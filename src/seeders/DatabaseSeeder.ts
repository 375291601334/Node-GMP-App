import { EntityManager, Reference } from '@mikro-orm/core';
import { Seeder, Factory, Faker } from '@mikro-orm/seeder';
import { User } from '../entities/user';
import { Product } from '../entities/product';
import { Cart } from '../entities/cart';
import { Item } from '../entities/item';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {

    const users = new UserFactory(em).each(user => {
      const cart = new CartFactory(em).makeOne({ user });
      
      const products = new ProductFactory(em).each(product => {
        const item = new ItemFactory(em).makeOne({ cart, product });
      }).make(2);
    }).make(10);
  }
}

class UserFactory extends Factory<User> {
  model = User;

  definition(): Partial<User> {
    return {};
  }
}

export class ProductFactory extends Factory<Product> {
  model = Product;

  definition(faker: Faker): Partial<Product> {
    return {
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.datatype.number({ min: 1, max: 100000 }),
    };
  }
}

export class CartFactory extends Factory<Cart> {
  model = Cart;

  definition(): Partial<Cart> {
    return {};
  }
}

export class ItemFactory extends Factory<Item> {
  model = Item;

  definition(faker: Faker): Partial<Item> {
    return {
      count: faker.datatype.number({ min: 1, max: 10 }),
    };
  }
}
