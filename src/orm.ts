import { Request, Response, NextFunction } from 'express';
import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/core';
import config from './mikro-orm.config';
import { User } from './entities/user';
import { Product } from './entities/product';
import { Cart } from './entities/cart';
import { Item } from './entities/item';
import { Order } from './entities/order';

export const DI = {} as {
  orm: MikroORM,
  em: EntityManager,
  userRepository: EntityRepository<User>,
  productRepository: EntityRepository<Product>,
  cartRepository: EntityRepository<Cart>,
  CartItemRepository: EntityRepository<Item>,
  orderRepository: EntityRepository<Order>,
};

export const init = async () => {
  DI.orm = await MikroORM.init(config);

  DI.em = DI.orm.em;

  DI.userRepository = DI.orm.em.getRepository(User);
  DI.productRepository = DI.orm.em.getRepository(Product);
  DI.cartRepository = DI.orm.em.getRepository(Cart);
  DI.CartItemRepository = DI.orm.em.getRepository(Item);
  DI.orderRepository = DI.orm.em.getRepository(Order);
};

export const requestContextMiddleware = (req: Request, res: Response, next: NextFunction) => {
  RequestContext.create(DI.orm.em, next);
};
