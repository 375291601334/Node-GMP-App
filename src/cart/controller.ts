import { Request, Response, Router } from 'express';
import joi, { ValidationResult } from 'joi';
import { ResponseBody } from '../models';
import { getProduct } from '../product';
import { ICart, ItemData } from './entities';
import { getCartForUser, createCartForUser, deleteCart, updateCartItems } from './service';

export const router = Router();
  
router.get('/', async (
  req: Request,
  res: Response<ResponseBody<{ cart: ICart, totalPrice: number }>>,
) => {
  try {
    let cart = await getCartForUser(req.userId);

    if (!cart) {
      cart = await createCartForUser(req.userId);
    }

    const totalPrice = cart.getTotalPrice();

    res.send({ data: { cart, totalPrice }, error: null });
  } catch (err) {
    res.status(500);
    res.send({ data: null, error: { message: 'Ooops, something went wrong' }});
    return;
  }
});

router.put('/', async (
  req: Request<any, any, ItemData>,
  res: Response<ResponseBody<{ cart: ICart, totalPrice: number }>>,
) => {
  const { error: validationError } = validateCartItem(req.body);
  if (validationError) {
    res.status(400);
    res.send({ data: null, error: { message: `Products are not valid: ${validationError.message}.` }});
    return;
  }

  const product = await getProduct(req.body.productId);
  if (!product) {
    res.status(404);
    res.send({ data: null, error: { message: `Product ${req.body.productId} not found!` }});
    return;
  }

  const cart = await getCartForUser(req.userId);
  if (!cart) {
    res.status(404);
    res.send({ data: null, error: { message: `Cart for user ${req.userId} not found!` }});
    return;
  } else { 
    const updatedCart = await updateCartItems(cart, product, req.body.count);

    if (updatedCart) {
      const totalPrice = updatedCart.getTotalPrice();
      res.send({ data: { cart: updatedCart, totalPrice }, error: null });
    } else {
      res.status(500);
      res.send({ data: null, error: { message: 'Ooops, something went wrong' }});
      return;
    }
  }
});

router.delete('/', async (
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

function validateCartItem(cartItem: ItemData): ValidationResult<ItemData> {
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

  const { error, value } = schema.validate(cartItem);
  return { error, value };
}
