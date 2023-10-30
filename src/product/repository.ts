
import { Product, IProduct } from './entities';

export const getProducts = async (): Promise<IProduct[]> => {
  return await Product.find({}).exec();
};

export const getProduct = async (productId: IProduct['id']): Promise<IProduct | null> => {
  return await Product.findOne({ _id: productId }).exec();
};
