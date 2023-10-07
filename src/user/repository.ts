import { User } from '../types';

const users: User[] = [
  { id: '0fe36d16-49bc-4aab-a227-f84df899a6cb' },
];

export const getUser = async (userId: User['id']): Promise<User | null> => {
  const user = users.find((user) => user.id === userId);

  return user || null;
};
