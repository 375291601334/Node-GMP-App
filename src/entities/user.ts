import { Collection, Entity, OneToMany, PrimaryKey } from '@mikro-orm/core';
import { Order } from './order';
import { Cart } from './cart';

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @OneToMany(() => Order, order => order.user, { nullable: true })
  orders? = new Collection<Order>(this);

  @OneToMany(() => Cart, cart => cart.user, { nullable: true })
  carts? = new Collection<Cart>(this);
}
