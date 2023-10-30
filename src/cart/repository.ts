import { IProduct } from '../product';
import { IUser } from '../user';
import { Cart, ICart } from './entities';

export const getCartForUser = async (userId: IUser['id']): Promise<ICart | null> => {
  return await Cart.findOne({ userId, isDeleted: false }).exec();
};

export const createCart = async (userId: IUser['id']): Promise<ICart> => {
  const cart = new Cart({ userId, items: [] });

  try {
    await cart.save();
    return cart;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

export const deleteCart = async (cart: ICart): Promise<boolean> => {
  try {
    await cart.updateOne({ isDeleted: true });
    return true;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

export const updateCartItems = async (cart: ICart, product: IProduct, count: number): Promise<ICart | null> => {
  const item = cart?.items.find((item) => item.product.id == product.id);

  try {
    if (item) {
      if (count == 0) {
        // delete item
        cart.items.pull({ _id: item._id });
        await cart.save();
      } else {
        // update item
        item.count = count;
        await cart.save();
      }
    } else {
      // add new item
      cart.items.push({ product: product.id, count });
      await cart.save();
    }

    return cart;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};
