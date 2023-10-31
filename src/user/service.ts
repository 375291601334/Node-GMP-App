import { IUser } from './entities';
import * as repository from './repository';

export const getUser = async (userId: IUser['id']): Promise<IUser | null> => {
  return await repository.getUser(userId);
};

export const getUserByEmail = async (email: IUser['email']): Promise<IUser | null> => {
  return await repository.getUserByEmail(email);
};

export const createUser = async (userData: { email: string; password: string; role: string }): Promise<IUser> => {
  return await repository.addUser(userData);
}
