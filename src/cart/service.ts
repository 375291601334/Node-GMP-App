import { Cart, CartItemDataEntity, User } from '../types';
import * as repository from './repository';

export const getCartForUser = async (userId: User['id']): Promise<Cart | null> => {
  const userCart = await repository.getCartForUser(userId);
  return userCart;
}

export const createCartForUser = async (userId: User['id']): Promise<Cart> => {  
  const cart = await repository.createCart(userId);
  return cart;
};

export const deleteCart = async (cartId: Cart['id']): Promise<boolean> => {
  const isCartDeleted = await repository.deleteCart(cartId);
  return isCartDeleted;
};

export const updateCartItems = async (cartId: Cart['id'], item: CartItemDataEntity): Promise<Cart | null> => {  
  const updatedCart = await repository.updateCartItems(cartId, item);
  return updatedCart;
};

export const getCartTotalPrice = (cart: Cart): number => {
  return cart.items.reduce((totalPrice, item) => {
    const itemPrice = item.count * item.product.price;
    totalPrice += itemPrice;
    return totalPrice;
  }, 0);
};
