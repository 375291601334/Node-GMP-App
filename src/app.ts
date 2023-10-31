import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { router as userRouter } from './user';
import { router as cartRouter } from './cart';
import { router as orderRouter } from './order';
import { router as productRouter } from './product';
import { authTokenMiddleware } from './user';

const PORT = 8000;
const HOST = 'localhost';
const DB_URL = 'mongodb://192.168.31.210:27017/node-gmp-db';

(async () => {
  const app = express();

  app.use(bodyParser.json());
  
  app.use('/api/auth', userRouter);
  
  app.use('/api', authTokenMiddleware);

  app.use('/api/profile/cart', cartRouter);
  app.use('/api/products', productRouter);
  app.use('/api/profile/cart/checkout', orderRouter);

  app.use(errorHandler);
  
  try {
    await mongoose.connect(DB_URL);
  } catch(e) {
    console.error(e);
  }

  app.listen(PORT, HOST, () => {
    console.log('Server is started');
  });
})();

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  res.status(500);
  res.send({ data: null, error: { message: 'Ooops, something went wrong' }});
};
