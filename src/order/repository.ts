
import { Cart } from '../entities/cart';
import { Order, OrderItems } from '../entities/order';
import { User } from '../entities/user';
import { DI } from '../orm';

export const addOrder = async (userId: User['id'], cart: Cart): Promise<Order> => {
  const items = await cart.items.reduce(async (acc, item) => {
    const { id, title, description, price } = await item.product.load();
    const items = await acc;
    items.push({ product: { id, title, description, price }, count: item.count });
    return items;
  }, Promise.resolve([] as OrderItems[]));

  const totalPrice = await cart.totalPrice;

  const order = new Order({ userId, cartId: cart.id, items, totalPrice });
  try {
    await DI.em.persistAndFlush(order);
  } catch (e) {
    console.log(e)
  }
  
  return order;
};
