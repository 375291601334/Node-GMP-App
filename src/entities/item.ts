import { Entity, ManyToOne, PrimaryKey, Property, Ref, Reference } from '@mikro-orm/core';
import { Product } from './product';
import { Cart } from './cart';

export type ItemData = {
  productId: Product['id'];
  count: Item['count'];
};

@Entity()
export class Item {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()', hidden: true })
  id!: string;

  @ManyToOne(() => Cart, { ref: true, hidden: true })
  cart!: Ref<Cart>;

  @ManyToOne(() => Product, { ref: true })
  product!: Ref<Product>;

  @Property()
  count!: number;

  constructor(cartId: Cart['id'], productId: Product['id'], count: number) {
    this.cart = Reference.createFromPK(Cart, cartId);
    this.product = Reference.createFromPK(Product, productId);
    this.count = count;
  }
}