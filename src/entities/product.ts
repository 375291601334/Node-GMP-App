import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Item } from './item';

@Entity()
export class Product {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @OneToMany(() => Item, item => item.product)
  items = new Collection<Item>(this);

  @Property()
  title!: string;

  @Property()
  description?: string;

  @Property()
  price!: number;

  constructor(data: { title: string; price: number; description?: string; }) {
    this.title = data.title;
    this.price = data.price;
    this.description = data.description;
  }
}
