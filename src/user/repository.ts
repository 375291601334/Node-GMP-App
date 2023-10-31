import { getEncryptedPassword } from './utils';
import { IUser, User } from './entities';

export const getUser = async (userId: IUser['id']): Promise<IUser | null> => {
  return await User.findOne({ _id: userId }).exec();
};

export const getUserByEmail = async (email: IUser['email']): Promise<IUser | null> => {
  return await User.findOne({ email }).exec();
};

export const addUser = async (userData: { email: string; password: string; role: string }): Promise<IUser> => {
  const { password, ...data } = userData;

  const user = new User({ ...data, password: getEncryptedPassword(password) });

  try {
    await user.save();
  } catch (e) {
    throw new Error((e as Error).message);
  }

  return user;
};
