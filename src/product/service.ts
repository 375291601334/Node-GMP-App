import { Product } from '../types';
import * as repository from './repository';

export const getProducts = async (): Promise<Product[]> => {
  const products = await repository.getProducts();
  return products;
};

export const getProduct = async (productId: Product['id']): Promise<Product> => {
  const product = await repository.getProduct(productId);

  if (product) return product;

  throw new Error(`Product ${productId} not found!`);
};
