import { User } from '../types';
import * as repository from './repository';

export const getUser = async (userId: User['id']): Promise<User> => {
  const user = await repository.getUser(userId);

  if (user) return user;
  
  throw new Error(`User ${userId} not found!`);
};
