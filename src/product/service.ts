import { IProduct } from './entities';
import * as repository from './repository';

export const getProducts = async (): Promise<IProduct[]> => {
  const products = await repository.getProducts();
  return products;
};

export const getProduct = async (productId: IProduct['id']): Promise<IProduct | null> => {
  const product = await repository.getProduct(productId);
  return product;
};
