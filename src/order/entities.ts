import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

export interface IOrder extends mongoose.Document {
  id: string;
  user: string;
  cart: string;
  items: IOrderItems[];
  payment: {
    type: string;
    address?: any;
    creditCard?: any;
  };
  delivery: {
    type: string;
    address: any;
  };
  comments: string;
  status: 'created' | 'completed';
  totalPrice: number;
}

export interface IOrderItems {
  product: {
    id: string;
    title: string;
    description?: string;
    price: number;
  };
  count: number;
}

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    _id: {
      type: String,
      default: () => uuid(),
      alias: 'id',
    },
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    cart: {
      type: String,
      ref: 'Cart',
      required: true,
    },
    items: Array<IOrderItems>,
    payment: {
      type: {
        type: String,
        required: false,
      },
      address: {
        type: mongoose.Schema.Types.Mixed,
        required: false,
      },
      creditCard: {
        type: mongoose.Schema.Types.Mixed,
        required: false,
      },
    },
    delivery: {
      type: {
        type: String,
        required: false,
      },
      address: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    },
    comments: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['created', 'completed'],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
