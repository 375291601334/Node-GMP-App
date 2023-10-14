import { Product } from '../types';

const products: Product[] = [
  {
    id: '51422fcd-0366-4186-ad5b-c23059b6f64f',
    title: 'Book',
    description: 'A very interesting book',
    price: 100
  },  
];

export const getProducts = async (): Promise<Product[]> => {
  return products;
};

export const getProduct = async (productId: Product['id']): Promise<Product | null> => {
  const product = products.find((product) => product.id === productId);

  return product || null;
};
