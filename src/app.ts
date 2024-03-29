import express, { Request, Response } from 'express';
import { Socket } from 'net';
import { Server } from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import 'dotenv/config';
import { router as userRouter, authTokenMiddleware } from './user';
import { router as cartRouter } from './cart';
import { router as orderRouter } from './order';
import { router as productRouter } from './product';

const PORT = Number(process.env.PORT || '8000');
const HOST = process.env.HOST || 'localhost';
const DB_URL = process.env.DB_URL || 'mongodb://192.168.31.210:27017/node-gmp-db';

void (async () => {
  const app = express();

  app.use(bodyParser.json());

  app.get('/api/health', (req, res) => {
    if (mongoose.connection.readyState === mongoose.ConnectionStates.connected) {
      res.status(200);
      res.send({ message: 'Application is healthy' });
    } else {
      res.status(500);
      res.send({ message: 'Error connecting to database' });
    }
  });

  app.use('/api/auth', userRouter);

  app.use('/api', (req, res, next) => void authTokenMiddleware(req, res, next));

  app.use('/api/profile/cart', cartRouter);
  app.use('/api/products', productRouter);
  app.use('/api/profile/cart/checkout', orderRouter);

  app.use(errorHandler);

  try {
    await mongoose.connect(DB_URL);
  } catch (e) {
    console.error(e);
  }

  const server = app.listen(PORT, HOST, () => {
    console.log('Server is started');
  });

  handleShutdown(server);
})();

function handleShutdown(server: Server) {
  let connections = [] as Socket[];

  server.on('connection', (connection) => {
    connections.push(connection);

    connection.on('close', () => {
      connections = connections.filter((currentConnection) => currentConnection !== connection);
    });
  });

  function handler(signal: string) {
    console.log(`Received ${signal} signal, shutting down gracefully`);

    server.close(() => {
      console.log('Closed out remaining connections');
      mongoose.connection.close(false);
      process.exit(0);
    });

    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      mongoose.connection.close(false);
      process.exit(1);
    }, 20000);

    connections.forEach((connection) => connection.end());

    setTimeout(() => {
      connections.forEach((connection) => connection.destroy());
    }, 10000);
  }

  process.on('SIGTERM', () => handler('SIGTERM'));
  process.on('SIGINT', () => handler('SIGINT'));
}

function errorHandler(err: Error, req: Request, res: Response) {
  res.status(500);
  res.send({ data: null, error: { message: 'Ooops, something went wrong' } });
}
