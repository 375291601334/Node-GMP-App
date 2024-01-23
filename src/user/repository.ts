import { getEncryptedPassword } from './utils';
import { IUser, User } from './entities';

export const getUser = async (userId: IUser['id']): Promise<IUser | null> => {
  return await User.findOne({ _id: userId }).exec();
};

export const getUserByEmail = async (email: IUser['email']): Promise<IUser | null> => {
  return await User.findOne({ email }).exec();
};

export const addUser = async (userData: {
  email: string;
  password: string;
  role: string;
}): Promise<Omit<IUser, 'password' | '_doc'>> => {
  const { password, ...data } = userData;

  const encryptedPassword = await getEncryptedPassword(password);
  const user = new User({ ...data, password: encryptedPassword });

  try {
    await user.save();
  } catch (e) {
    throw new Error((e as Error).message);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: savedPassword, ...userWithoutPassword } = user._doc;
  return userWithoutPassword;
};
