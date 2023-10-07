import { Request, Response } from 'express';
import { Product, ResponseBody } from '../types';
import { getProducts, getProduct } from './service';

export const getProductsHandler = async (
  req: Request,
  res: Response<ResponseBody<Product[]>>,
) => {
  const products = await getProducts();
  res.send({ data: products, error: null });
};

export const getProductHandler = async (
  req: Request<{ productId: string }, any, any>,
  res: Response<ResponseBody<Product>>,
) => {
  const { productId } = req.params;

  try {
    const product = await getProduct(productId);
    res.send({ data: product, error: null });
  } catch (err) {
    res.status(404);
    res.send({ data: null, error: { message: (err as Error).message }});
  }
};
