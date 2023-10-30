import { User } from '../entities/user';
import { Cart } from '../entities/cart';
import { Item, ItemData } from '../entities/item';
import { DI } from '../orm';

export const getCartForUser = async (userId: User['id']): Promise<Cart | null> => {
  const cart = await DI.cartRepository.findOne({ user: { id: userId }, isDeleted: false }, { populate: ['items', 'items.product'] });

  return cart;
};

export const createCart = async (userId: User['id']): Promise<Cart> => {
  const cart = new Cart(userId);
  await DI.em.persistAndFlush(cart);

  return cart;
};

export const deleteCart = async (cart: Cart): Promise<boolean> => {
  cart.isDeleted = true;
  await DI.em.flush();

  return true;
};

export const updateCartItems = async (cart: Cart, { productId, count }: ItemData): Promise<Cart | null> => {
  const item = await DI.CartItemRepository.findOne({ cart: { id: cart.id }, product: { id: productId }}, { populate: ['product'] });

  if (item) {
    if (item.count == 0) {
      // delete item
      await DI.em.removeAndFlush(item);
    } else {
      // update item
      item.count = count;
      await DI.em.flush();
    }
  } else {
    // add new item
    const newItem = new Item(cart.id, productId, count);
    await DI.em.persistAndFlush(newItem);
  }

  return cart;
};
