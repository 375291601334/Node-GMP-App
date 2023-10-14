import { Request, Response } from 'express';
import joi, { ValidationResult } from 'joi';
import { Cart, CartItemDataEntity, ResponseBody } from '../types';
import { getCartForUser, createCartForUser, deleteCart, updateCartItems, getCartTotalPrice } from './service';
import { getProduct } from '../product/service';

export const getCartHandler = async (
  req: Request,
  res: Response<ResponseBody<{ cart: Cart, totalPrice: number }>>,
) => {
  try {
    let cart = await getCartForUser(req.userId);

    if (!cart) {
      cart = await createCartForUser(req.userId);
    }

    res.send({ data: { cart, totalPrice: getCartTotalPrice(cart) }, error: null });
  } catch (err) {
    res.status(500);
    res.send({ data: null, error: { message: 'Ooops, something went wrong' }});
    return;
  }
};

export const deleteCartHandler = async (
  req: Request,
  res: Response<ResponseBody<{ success: boolean }>>,
) => {
  const cart = await getCartForUser(req.userId);

  if (!cart) {
    res.status(404);
    res.send({ data: null, error: { message: `Cart for user ${req.userId} not found!` }});
    return;
  } else {
    const success = await deleteCart(cart.id);

    if (!success) {
      res.status(500);
      res.send({ data: null, error: { message: 'Ooops, something went wrong' }});
      return;
    }

    res.send({ data: { success }, error: null  });
  }
};

const validateCartItem = (cartItem: CartItemDataEntity): ValidationResult<CartItemDataEntity> => {
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

export const updateCartHandler = async (
  req: Request<any, any, CartItemDataEntity>,
  res: Response<ResponseBody<{ cart: Cart, totalPrice: number }>>,
) => {
  const { error: validationError, value: cartItem } = validateCartItem(req.body);
  if (validationError) {
    res.status(400);
    res.send({ data: null, error: { message: `Products are not valid: ${validationError.message}.` }});
    return;
  }

  const product = await getProduct(cartItem.productId);
  if (!product) {
    res.status(404);
    res.send({ data: null, error: { message: `Product ${cartItem.productId} not found!` }});
    return;
  }

  const cart = await getCartForUser(req.userId);
  if (!cart) {
    res.status(404);
    res.send({ data: null, error: { message: `Cart for user ${req.userId} not found!` }});
    return;
  } else { 
    const updatedCart = await updateCartItems(cart.id, cartItem);

    if (updatedCart) {
      res.send({ data: { cart: updatedCart, totalPrice: getCartTotalPrice(updatedCart) }, error: null });
    } else {
      res.status(500);
      res.send({ data: null, error: { message: 'Ooops, something went wrong' }});
      return;
    }
  }
};
