import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

export interface IUser extends mongoose.Document {
  id: string;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    _id: {
      type: String,
      default: () => uuid(),
      alias: 'id',
    },
  },
);

export const User = mongoose.model<IUser>('User', UserSchema);
