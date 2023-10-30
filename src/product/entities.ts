import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

export interface IProduct extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  price: number;
}

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    _id: {
      type: String,
      default: () => uuid(),
      alias: 'id',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
  },
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
