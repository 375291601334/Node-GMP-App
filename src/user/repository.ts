
import { User } from '../entities/user';
import { DI } from '../orm';

export const getUser = async (userId: User['id']): Promise<User | null> => {
  return await DI.userRepository.findOne(userId);
};
