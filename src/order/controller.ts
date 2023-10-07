import { Request, Response } from 'express';
import { Order, ResponseBody } from '../types';
import { createOrderForUser } from './service';

export const postOrderHandler = async (
  req: Request,
  res: Response<ResponseBody<{ order: Order }>>,
) => {
  try {
    const order = await createOrderForUser(req.userId);
    res.send({ data: { order }, error: null });
  } catch (err) {
    res.status(404);
    res.send({ data: null, error: { message: (err as Error).message }});
  }
};
