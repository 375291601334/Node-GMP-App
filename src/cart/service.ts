import { IProduct } from '../product';
import { IUser } from '../user';
import { ICart } from './entities';
import * as repository from './repository';

export const getCartForUser = async (userId: IUser['id']): Promise<ICart | null> => {
  const userCart = await repository.getCartForUser(userId);
  return userCart;
};

export const createCartForUser = async (userId: IUser['id']): Promise<ICart> => {
  const cart = await repository.createCart(userId);
  return cart;
};

export const deleteCart = async (cart: ICart): Promise<boolean> => {
  const isCartDeleted = await repository.deleteCart(cart);
  return isCartDeleted;
};

export const updateCartItems = async (cart: ICart, product: IProduct, count: number): Promise<ICart | null> => {
  const updatedCart = await repository.updateCartItems(cart, product, count);
  return updatedCart;
};
