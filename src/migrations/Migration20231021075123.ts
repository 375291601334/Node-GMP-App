import { Migration } from '@mikro-orm/migrations';

export class Migration20231021075123 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "product" ("id" uuid not null default gen_random_uuid(), "title" varchar(255) not null, "description" varchar(255) not null, "price" int not null, constraint "product_pkey" primary key ("id"));');

    this.addSql('create table "user" ("id" uuid not null default gen_random_uuid(), constraint "user_pkey" primary key ("id"));');

    this.addSql('create table "cart" ("id" uuid not null default gen_random_uuid(), "user_id" uuid not null, "is_deleted" boolean not null, constraint "cart_pkey" primary key ("id"));');

    this.addSql('create table "order" ("id" uuid not null default gen_random_uuid(), "user_id" uuid not null, "cart_id" uuid not null, "items" jsonb not null, "payment" jsonb not null, "delivery" jsonb not null, "comments" varchar(255) null, "status" varchar(255) not null, "total_price" int not null, constraint "order_pkey" primary key ("id"));');
    this.addSql('alter table "order" add constraint "order_cart_id_unique" unique ("cart_id");');

    this.addSql('create table "item" ("id" uuid not null default gen_random_uuid(), "cart_id" uuid not null, "product_id" uuid not null, "count" int not null, constraint "item_pkey" primary key ("id"));');

    this.addSql('alter table "cart" add constraint "cart_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "order" add constraint "order_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "order" add constraint "order_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade;');

    this.addSql('alter table "item" add constraint "item_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade;');
    this.addSql('alter table "item" add constraint "item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');
  }

}
