import { Request, Response, Router } from 'express';
import joi, { ValidationResult } from 'joi';
import { ResponseBody } from '../types';
import { Cart } from '../entities/cart';
import { ItemData } from '../entities/item';
import { getCartForUser, createCartForUser, deleteCart, updateCartItems } from './service';
import { getProduct } from '../product/service';

export const cartRouter = Router();
  
cartRouter.get('/', async (
  req: Request,
  res: Response<ResponseBody<{ cart: Cart, totalPrice: number }>>,
) => {
  try {
    let cart = await getCartForUser(req.userId);

    if (!cart) {
      cart = await createCartForUser(req.userId);
    }

    const totalPrice = await cart.totalPrice;

    res.send({ data: { cart, totalPrice }, error: null });
  } catch (err) {
    res.status(500);
    res.send({ data: null, error: { message: 'Ooops, something went wrong' }});
    return;
  }
});

cartRouter.put('/', async (
  req: Request<any, any, ItemData>,
  res: Response<ResponseBody<{ cart: Cart, totalPrice: number }>>,
) => {
  const { error: validationError, value: CartItem } = validateCartItem(req.body);
  if (validationError) {
    res.status(400);
    res.send({ data: null, error: { message: `Products are not valid: ${validationError.message}.` }});
    return;
  }

  const product = await getProduct(CartItem.productId);
  if (!product) {
    res.status(404);
    res.send({ data: null, error: { message: `Product ${CartItem.productId} not found!` }});
    return;
  }

  const cart = await getCartForUser(req.userId);
  if (!cart) {
    res.status(404);
    res.send({ data: null, error: { message: `Cart for user ${req.userId} not found!` }});
    return;
  } else { 
    const updatedCart = await updateCartItems(cart, CartItem);

    if (updatedCart) {
      const totalPrice = await updatedCart.totalPrice;
      res.send({ data: { cart: updatedCart, totalPrice }, error: null });
    } else {
      res.status(500);
      res.send({ data: null, error: { message: 'Ooops, something went wrong' }});
      return;
    }
  }
});

cartRouter.delete('/', async (
  req: Request,
  res: Response<ResponseBody<{ success: boolean }>>,
) => {
  const cart = await getCartForUser(req.userId);

  if (!cart) {
    res.status(404);
    res.send({ data: null, error: { message: `Cart for user ${req.userId} not found!` }});
    return;
  } else {
    const success = await deleteCart(cart);

    if (!success) {
      res.status(500);
      res.send({ data: null, error: { message: 'Ooops, something went wrong' }});
      return;
    }

    res.send({ data: { success }, error: null  });
  }
});

function validateCartItem(CartItem: ItemData): ValidationResult<ItemData> {
  const schema = joi.object({
    productId: joi.string()
      .guid()
      .min(1)
      .max(50)
      .required(),

    count: joi.number()
      .integer()
      .required(),
  });

  const { error, value } = schema.validate(CartItem);
  return { error, value };
}
