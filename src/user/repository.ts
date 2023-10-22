
import { IUser, User } from './entities';

export const getUser = async (userId: IUser['id']): Promise<IUser | null> => {
  return await User.findOne({ _id: userId }).exec();
};
