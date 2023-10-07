import { Cart, User } from '../types';
import * as repository from './repository';

export const getCartForUser = async (userId: User['id']): Promise<Cart> => {
  const userCart = await repository.getCartForUser(userId);

  if (userCart) return userCart;

  throw new Error(`Cart for user ${userId} not found!`);
}

export const createCartForUser = async (userId: User['id']): Promise<Cart> => {  
  const cart = await repository.createCart(userId);
  return cart;
};

export const deleteCartForUser = async (userId: User['id']): Promise<boolean> => {
  const cart = await getCartForUser(userId);

  const isCartDeleted = await repository.deleteCart(cart.id);
  return isCartDeleted;
};

export const updateCartItemsForUser = async (userId: User['id'], items: Cart['items']): Promise<Cart | null> => {
  const cart = await getCartForUser(userId);
  
  const updatedCart = await repository.updateCartItems(cart.id, items);
  return updatedCart;
};

export const getCartTotalPrice = (cart: Cart): number => {
  return cart.items.reduce((totalPrice, item) => {
    const itemPrice = item.count * item.product.price;
    totalPrice += itemPrice;
    return totalPrice;
  }, 0);
};
