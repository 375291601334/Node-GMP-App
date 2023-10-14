import { User } from '../types';
import * as repository from './repository';

export const getUser = async (userId: User['id']): Promise<User | null> => {
  const user = await repository.getUser(userId);
  return user;
};
