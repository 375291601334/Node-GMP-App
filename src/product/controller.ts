import { Request, Response, Router } from 'express';
import { ResponseBody } from '../models';
import { IProduct } from './entities';
import { getProducts, getProduct } from './service';

export const router = Router();

router.get('/', (req, res) => void getProductsHandler(req, res));
router.get('/:productId', (req, res) => void getProductHandler(req, res));

async function getProductsHandler(req: Request, res: Response<ResponseBody<IProduct[]>>) {
  const products = await getProducts();
  res.send({ data: products, error: null });
}

async function getProductHandler(req: Request<{ productId: string }, any, any>, res: Response<ResponseBody<IProduct>>) {
  const { productId } = req.params;
  const product = await getProduct(productId);

  if (!product) {
    res.status(404);
    res.send({ data: null, error: { message: `Product ${productId} was not found!` } });
    return;
  }

  res.send({ data: product, error: null });
}
