import { Product } from '../entities/product';
import * as repository from './repository';

export const getProducts = async (): Promise<Product[]> => {
  const products = await repository.getProducts();
  return products;
};

export const getProduct = async (productId: Product['id']): Promise<Product | null> => {
  const product = await repository.getProduct(productId);
  return product;
};
