import { CartDataEntity, User, Cart } from '../types';
import { generateUUID } from '../utils';
import * as productRepository from '../product/repository';

let carts: CartDataEntity[] = [
  {
    id: '1434fec6-cd85-420d-95c0-eee2301a971d',
    userId: '0fe36d16-49bc-4aab-a227-f84df899a6cb',
    isDeleted: false,
    items: [
      {
        productId: '51422fcd-0366-4186-ad5b-c23059b6f64f',
        count: 2,
      },
    ],
  }  
];

export const modifyCart = async (cart: CartDataEntity): Promise<Cart> => {
  const { isDeleted, items, ...rest } = cart;

  const modifiedItems = await items.reduce(async (previousPromise, { productId, count }) => {
    const items = await previousPromise;
  
    const product = await productRepository.getProduct(productId);

    if (product) items.push({ product, count });

    return items;
  }, Promise.resolve([] as Cart['items']));

  return { ...rest, items: modifiedItems };
};

export const getCartForUser = async (userId: User['id']): Promise<Cart | null> => {
  const cart = carts.find((cart) => cart.userId === userId && !cart.isDeleted);

  return cart ? await modifyCart(cart) : null;
};

export const createCart = async (userId: User['id']): Promise<Cart> => {
  const cart: CartDataEntity = {
    id: generateUUID(),
    userId,
    isDeleted: false,
    items: [],
  };

  carts.push(cart);
  return await modifyCart(cart);
};

const updateCart = async (cartId: CartDataEntity['id'], cartData: Partial<CartDataEntity>): Promise<CartDataEntity | null> => {
  const cartToUpdate = carts.find((cart) => cart.id === cartId);

  if (!cartToUpdate) return null;

  const updatedCart = { ...cartToUpdate, ...cartData };

  carts = carts.map((cart) => {
    if (cart.id === cartToUpdate.id) return updatedCart;
    return cart;
  });

  return updatedCart;
};

export const deleteCart = async (cartId: CartDataEntity['id']): Promise<boolean> => {
  const deletedCart = await updateCart(cartId, { isDeleted: true });
  return !!deletedCart;
};

export const updateCartItems = async (cartId: CartDataEntity['id'], items: Cart['items']): Promise<Cart | null> => {
  const itemsToSave = items.map(({ product, count }) => ({ productId: product.id, count }));

  const updatedCart = await updateCart(cartId, { items: itemsToSave });
  return updatedCart ? await modifyCart(updatedCart) : null;
};
