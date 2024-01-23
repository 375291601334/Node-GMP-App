import { IUser } from '../user';
import { IProduct } from '../product';
import { ICart, deleteCart } from '../cart';
import { Order, IOrder } from './entities';

export const addOrder = async (userId: IUser['id'], cart: ICart): Promise<IOrder> => {
  const order = new Order({
    user: userId,
    cart: cart.id,
    items: cart.items.map(({ product, count }) => ({ product: { ...product } as IProduct, count })),
    payment: {
      type: 'paypal',
      creditCard: 'Priorbank Gold Platina',
    },
    delivery: {
      type: 'post',
      address: { country: 'Belarus', addressLine: 'Minsk, str. Lenina, 97' },
    },
    comments: 'Some comment',
    status: 'created',
    totalPrice: cart.getTotalPrice(),
  });

  try {
    await order.save();
    await deleteCart(cart);
  } catch (e) {
    throw new Error((e as Error).message);
  }

  return order;
};
