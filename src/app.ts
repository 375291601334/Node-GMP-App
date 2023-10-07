import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { deleteCartHandler, getCartHandler, updateCartHandler } from './cart/controller';
import { postOrderHandler } from './order/controller';
import { getProductHandler, getProductsHandler } from './product/controller';
import { authValidation } from './user/controller';

const PORT = 8000;
const HOST = 'localhost';

const app = express();
const cartRouter = express.Router();
const productsRouter = express.Router();

cartRouter.get('/', getCartHandler);
cartRouter.put('/', updateCartHandler);
cartRouter.delete('/', deleteCartHandler);
cartRouter.post('/checkout', postOrderHandler)

productsRouter.get('/', getProductsHandler);
productsRouter.get('/:productId', getProductHandler);

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500);
  res.send({ data: null, error: { message: 'Ooops, something went wrong' }});
};

app.use(bodyParser.json());

app.use('/api', authValidation);

app.use('/api/profile/cart', cartRouter, errorHandler);
app.use('/api/products', productsRouter);

app.use(errorHandler);

app.listen(PORT, HOST, () => {
  console.log('Server is started');
});
