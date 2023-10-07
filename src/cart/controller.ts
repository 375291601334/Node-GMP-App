import { Request, Response } from 'express';
import joi, { ValidationResult } from 'joi';
import { Cart, CartItemDataEntity, ResponseBody } from '../types';
import { getCartForUser, createCartForUser, deleteCartForUser, updateCartItemsForUser, getCartTotalPrice } from './service';
import { getProduct } from '../product/service';

export const getCartHandler = async (
  req: Request,
  res: Response<ResponseBody<{ cart: Cart, totalPrice: number }>>,
) => {
  try {
    const cart = await getCartForUser(req.userId);
    const totalPrice = getCartTotalPrice(cart);

    res.send({ data: { cart, totalPrice }, error: null });
  } catch (err) {
    res.status(404);
    res.send({ data: null, error: { message: (err as Error).message }});
  }
};

export const postCartHandler = async (
  req: Request,
  res: Response<ResponseBody<{ cart: Cart, totalPrice: number }>>,
) => {
  const cart = await createCartForUser(req.userId);
  const totalPrice = getCartTotalPrice(cart);

  res.send({ data: { cart, totalPrice }, error: null });
};

export const deleteCartHandler = async (
  req: Request,
  res: Response<ResponseBody<{ success: boolean }>>,
) => {
  try {
    const success = await deleteCartForUser(req.userId);

    if (!success) {
      res.status(500);
      res.send({ data: null, error: { message: 'Ooops, something went wrong' }});
    }

    res.send({ data: { success }, error: null  });
  } catch (err) {
    res.status(404);
    res.send({ data: null, error: { message: (err as Error).message }});
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

  const { error, value } = schema.validate({ username: 'abc', birth_year: 1994 });
  return { error, value };
}

export const updateCartHandler = async (
  req: Request<any, any, CartItemDataEntity>,
  res: Response<ResponseBody<{ cart: Cart, totalPrice: number }>>,
) => {
  try {
    const { error: validationError, value: cartItem } = validateCartItem(req.body);

    if (validationError) {
      res.status(400);
      res.send({ data: null, error: { message: validationError.message }});
    }

    try {
      getProduct(cartItem.productId);
    } catch (err) {
      res.status(404);
      res.send({ data: null, error: { message: (err as Error).message }});
    }

    const cart = await updateCartItemsForUser(req.userId, cartItem);

    if (cart) {
      const totalPrice = getCartTotalPrice(cart);

      res.send({ data: { cart, totalPrice }, error: null });
    } else {
      res.status(500);
      res.send({ data: null, error: { message: 'Ooops, something went wrong' }});
    }
  } catch (err) {
    res.status(404);
    res.send({ data: null, error: { message: (err as Error).message }});
  }
};
