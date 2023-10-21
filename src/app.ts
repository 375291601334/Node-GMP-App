import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import * as orm from './orm';
import { cartRouter } from './cart/controller';
import { orderRouter } from './order/controller';
import { productRouter } from './product/controller';
import { authValidation } from './user/controller';

const PORT = 8000;
const HOST = 'localhost';

(async () => {
  await orm.init();

  const app = express();

  app.use(bodyParser.json());
  app.use(orm.requestContextMiddleware);
  app.use('/api', authValidation);

  app.use('/api/profile/cart', cartRouter);
  app.use('/api/products', productRouter);
  app.use('/api/profile/cart/checkout', orderRouter);

  app.use(errorHandler);

  app.listen(PORT, HOST, () => {
    console.log('Server is started');
  });
})();

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  res.status(500);
  res.send({ data: null, error: { message: 'Ooops, something went wrong' }});
};
