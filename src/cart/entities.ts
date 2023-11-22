import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import { IProduct } from '../product';

export type ItemData = {
  productId: string;
  count: number;
};

export interface ICartItem extends mongoose.Document {
  id: string;
  product: mongoose.PopulatedDoc<mongoose.Document<string> & IProduct>;
  count: number;
}

const CartItemSchema = new mongoose.Schema<ICartItem>({
  _id: {
    type: String,
    default: () => uuid(),
    alias: 'id',
  },
  product: {
    type: String,
    ref: 'Product',
    required: true,
    autopopulate: true,
  },
  count: {
    type: Number,
    required: true,
  },
});
// eslint-disable-next-line @typescript-eslint/no-var-requires
CartItemSchema.plugin(require('mongoose-autopopulate'));

export interface ICart extends mongoose.Document {
  id: string;
  userId: string;
  isDeleted: boolean;
  items: mongoose.Types.DocumentArray<ICartItem>;
  getTotalPrice: () => number;
}

type ICartModel = mongoose.Model<ICart, object, ICart>;

const CartSchema = new mongoose.Schema<ICart, ICartModel, ICart>({
  _id: {
    type: String,
    default: () => uuid(),
    alias: 'id',
  },
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
  items: {
    type: [CartItemSchema],
    required: true,
    autopopulate: true,
  },
});
// eslint-disable-next-line @typescript-eslint/no-var-requires
CartSchema.plugin(require('mongoose-autopopulate'));

CartSchema.methods.getTotalPrice = function (): number {
  return this.items.reduce((totalPrice, item) => {
    const itemPrice = item.count * (item.product as IProduct).price;
    return totalPrice + itemPrice;
  }, 0);
};

export const Cart = mongoose.model<ICart, ICartModel>('Cart', CartSchema);
