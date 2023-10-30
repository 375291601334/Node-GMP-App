
import { Product } from '../entities/product';
import { DI } from '../orm';

export const getProducts = async (): Promise<Product[]> => {
  return await DI.productRepository.findAll();
};

export const getProduct = async (productId: Product['id']): Promise<Product | null> => {
  return await DI.productRepository.findOne(productId);
};
