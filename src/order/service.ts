import { Cart } from '../entities/cart';
import { Order } from '../entities/order';
import { User } from '../entities/user';
import * as repository from './repository';

export const createOrder = async (userId: User['id'], cart: Cart): Promise<Order> => {
  const order = repository.addOrder(userId, cart);
  return order;
};
