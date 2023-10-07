import { Request, Response } from 'express';
import { Cart, ResponseBody } from '../types';
import { getCartForUser, createCartForUser, deleteCartForUser, updateCartItemsForUser, getCartTotalPrice } from './service';

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

export const updateCartHandler = async (
  req: Request<any, any, Partial<Cart>>,
  res: Response<ResponseBody<{ cart: Cart, totalPrice: number }>>,
) => {
  try {
    const cart = await updateCartItemsForUser(req.userId, req.body.items || []);

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
