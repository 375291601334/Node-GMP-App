import { Entity, ManyToOne, OneToOne, PrimaryKey, Property, Reference, Ref } from '@mikro-orm/core';
import { Product } from './product';
import { User } from './user';
import { Cart } from './cart';

type ORDER_STATUS = 'created' | 'completed';

interface Delivery {
  type: string;
  address: any;
}

interface Payment {
  type: string;
  address?: any;
  creditCard?: any;
}

export interface OrderItems {
  product: {
    id: string;
    title: string;
    description?: string;
    price: number;
  };
  count: number;
}

@Entity()
export class Order {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ManyToOne(() => User, { ref: true })
  user!: Ref<User>;

  @OneToOne(() => Cart, { ref: true })
  cart!: Ref<Cart>;

  @Property({ type: 'json' })
  items!: OrderItems[];

  @Property({ type: 'json' })
  payment!: Payment;

  @Property({ type: 'json' })
  delivery!: Delivery;

  @Property({ nullable: true })
  comments?: string;
  
  @Property()
  status!: ORDER_STATUS;

  @Property()
  totalPrice!: number;

  constructor (data: { userId: User['id'], cartId: Cart['id'], items: OrderItems[], totalPrice: number, payment?: Payment, delivery?: Delivery,  comments?: string }) {
    this.user = Reference.createFromPK(User, data.userId);
    this.cart = Reference.createFromPK(Cart, data.cartId);
    this.items = data.items;
    this.payment = data.payment || {
      type: 'paypal',
      address: undefined,
      creditCard: undefined
    };
    this.delivery = data.delivery || {
      type: 'post',
      address: undefined
    };
    this.comments = data.comments;
    this.status = 'created';
    this.totalPrice = data.totalPrice;
  }
}