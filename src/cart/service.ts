import { User } from '../entities/user';
import { Cart } from '../entities/cart';
import { ItemData } from '../entities/item';
import * as repository from './repository';

export const getCartForUser = async (userId: User['id']): Promise<Cart | null> => {
  const userCart = await repository.getCartForUser(userId);
  return userCart;
}

export const createCartForUser = async (userId: User['id']): Promise<Cart> => {  
  const cart = await repository.createCart(userId);
  return cart;
};

export const deleteCart = async (cart: Cart): Promise<boolean> => {
  const isCartDeleted = await repository.deleteCart(cart);
  return isCartDeleted;
};

export const updateCartItems = async (cart: Cart, item: ItemData): Promise<Cart | null> => {  
  const updatedCart = await repository.updateCartItems(cart, item);
  return updatedCart;
};
