import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

export interface IUser extends mongoose.Document {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  _doc: Omit<this,'_doc'>;
}

export type JwtTokenData = {
  user_id: string;
  email: string;
  password: string;
  role: string;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    _id: {
      type: String,
      default: () => uuid(),
      alias: 'id',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      required: true,
    }
  },
);

export const User = mongoose.model<IUser>('User', UserSchema);
