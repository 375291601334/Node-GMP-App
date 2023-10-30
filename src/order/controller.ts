import { Request, Response, Router } from 'express';
import { ResponseBody } from '../models';
import { getCartForUser } from '../cart';
import { IOrder } from './entities';
import { createOrder } from './service';

export const router = Router();
  
router.post('/', async (
  req: Request,
  res: Response<ResponseBody<{ order: IOrder }>>,
) => {
  try {
    const cart = await getCartForUser(req.userId);

    if (!cart) {
      res.status(404);
      res.send({ data: null, error: { message: `Cart for user ${req.userId} not found!` }});
      return;
    } else if (cart.items.length == 0) {
      res.status(400);
      res.send({ data: null, error: { message: `Cart for user ${req.userId} is empty!` }});
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
});
