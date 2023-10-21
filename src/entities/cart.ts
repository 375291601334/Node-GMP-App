import { Collection, Entity, OneToMany, ManyToOne, PrimaryKey, Property, Ref, Reference } from '@mikro-orm/core';
import { User } from './user';
import { Item } from './item';

@Entity()
export class Cart {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ManyToOne(() => User, { ref: true })
  user!: Ref<User>;

  @OneToMany(() => Item, item => item.cart)
  items = new Collection<Item>(this);

  @Property({ hidden: true })
  isDeleted: boolean = false;

  @Property({ persist: false, hidden: true })
  get totalPrice() {
    return this.items.reduce(async (totalPriceAccumulator, item) => {
      const productPrice = await item.product.load('price');
      const itemPrice = item.count * productPrice;
  
      const previousTotalPrice = await totalPriceAccumulator;
      return previousTotalPrice + itemPrice;
    }, Promise.resolve(0));
  }

  constructor(userId: User['id']) {
    this.user = Reference.createFromPK(User, userId);
  }
}
