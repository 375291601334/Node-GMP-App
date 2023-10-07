import { Request, Response, NextFunction } from 'express';
import { getUser } from './service';

export const authValidation = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.header('x-user-id');
  
  if (!userId) {
    res.status(401);
    res.send({ data: null, error: { message: 'Header x-user-id is missing' } });
    return;
  };

  const user = await getUser(userId);

  if (!user) {
    res.status(403);
    res.send({ data: null, error: { message: `Not found user with id ${userId}` } });
    return;
  }

  req.userId = user.id;
  next();
};
