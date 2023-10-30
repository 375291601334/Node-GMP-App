import { Request, Response, Router } from 'express';
import { ResponseBody } from '../types';
import { Product } from '../entities/product';
import { getProducts, getProduct } from './service';

export const productRouter = Router();

productRouter.get('/', async (
  req: Request,
  res: Response<ResponseBody<Product[]>>,
) => {
  const products = await getProducts();
  res.send({ data: products, error: null });
});

productRouter.get('/:productId', async (
  req: Request<{ productId: string }, any, any>,
  res: Response<ResponseBody<Product>>,
) => {
  const { productId } = req.params;
  const product = await getProduct(productId);

  if (!product) {
    res.status(404);
    res.send({ data: null, error: { message: `Product ${productId} was not found!` }});
    return;
  }

  res.send({ data: product, error: null });
});
