import { IUser } from '../user';
import { ICart } from '../cart';
import { IOrder } from './entities';
import * as repository from './repository';

export const createOrder = async (userId: IUser['id'], cart: ICart): Promise<IOrder> => {
  const order = repository.addOrder(userId, cart);
  return order;
};
