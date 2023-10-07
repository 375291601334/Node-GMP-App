import { Request, Response } from 'express';
import { Order, ResponseBody } from '../types';
import { createOrder } from './service';
import { getCartForUser } from '../cart/service';

export const postOrderHandler = async (
  req: Request,
  res: Response<ResponseBody<{ order: Order }>>,
) => {
  try {
    const cart = await getCartForUser(req.userId);

    if (!cart) {
      res.status(404);
      res.send({ data: null, error: { message: `Cart for user ${req.userId} not found!` }});
      return;
    } else { 
      const order = await createOrder(req.userId, cart);
      res.send({ data: { order }, error: null });
    }
  } catch (err) {
    res.status(500);
    res.send({ data: null, error: { message: 'Ooops, something went wrong' }});
    return;
  }
};
