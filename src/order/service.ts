import { Order, User, ORDER_STATUS, Cart } from '../types';
import { generateUUID } from '../utils';
import * as repository from './repository';
import { getCartTotalPrice } from '../cart/service';

export const createOrder = async (userId: User['id'], cart: Cart): Promise<Order> => {
  const newOrder = {
    id: generateUUID(),
    userId,
    cartId: cart.id,
    items: cart.items,
    payment: {
      type: 'paypal',
      address: undefined,
      creditCard: undefined
    },
    delivery: {
      type: 'post',
      address: undefined
    },
    comments: '',
    status: 'created' as ORDER_STATUS,
    totalPrice: getCartTotalPrice(cart),
  };

  const order = repository.addOrder(newOrder);
  return order;
};
