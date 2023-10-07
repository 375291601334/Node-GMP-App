import { Request, Response, NextFunction } from 'express';
import { getUser } from './service';

export const authValidation = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.header('x-user-id');
  const user = userId ? await getUser(userId) : null;

  if (!user) {
    res.status(401);
    res.send({ data: null, error: { message: 'Header x-user-id is missing or no user with such id' } });
    return;
  };

  req.userId = user.id;
  next();
};
