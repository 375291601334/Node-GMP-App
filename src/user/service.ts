import { IUser } from './entities';
import * as repository from './repository';

export const getUser = async (userId: IUser['id']): Promise<IUser | null> => {
  const user = await repository.getUser(userId);
  return user;
};
