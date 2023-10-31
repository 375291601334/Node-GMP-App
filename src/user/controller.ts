import { Request, Response, NextFunction, Router } from 'express';
import joi, { ValidationResult } from 'joi';
import { ResponseBody } from '../models';
import { getJwtToken, getUserDataFromJwtToken, isPasswordValid } from './utils';
import { IUser } from './entities';
import { createUser, getUser, getUserByEmail } from './service';

export const router = Router();

router.post('/register', async (
  req: Request<any, any, { email: string; password: string; role: string }>,
  res: Response<ResponseBody<Omit<IUser, 'password' | '_doc'>>>,
) => {
  const { error: validationError } = validateUserData(req.body);
  if (validationError) {
    res.status(400);
    res.send({ data: null, error: { message: `User data are not valid: ${validationError.message}.` }});
    return;
  }

  const { email, password, role } = req.body;
  const user = await getUserByEmail(email);

  if (user) {
    res.status(400);
    res.send({ data: null, error: { message: `User with ${email} email already exists!` } });
    return;
  }

  try {
    const newUser = await createUser({ email, password, role });
    res.send({ data: newUser, error: null });
  } catch (err) {
    res.status(500);
    res.send({ data: null, error: { message: 'Ooops, something went wrong' }});
    return;
  }
});

router.post('/login', async (
  req: Request<any, any, { email: string; password: string }>,
  res: Response<ResponseBody<{ token: string }>>,
) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);

    if (!user) {
      res.status(404);
      res.send({ data: null, error: { message: `Not found user with email ${email}` } });
      return;
    }

    if (!(await isPasswordValid(password, user.password))) {
      res.status(401);
      res.send({ data: null, error: { message: `Wrong password for ${email}` } });
      return;
    }

    const token = getJwtToken({ user_id: user.id, email, password, role: user.role });
    res.send({ data: { token }, error: null });
  } catch (err) {
    res.status(500);
    res.send({ data: null, error: { message: 'Ooops, something went wrong' }});
    return;
  }
});

export const authTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {  
  if (!req.headers.authorization) {
    res.status(401);
    res.send({ data: null, error: { message: 'Authorization header is missing' } });
    return;
  };

  const [tokenType, token] = req.headers.authorization.split(' ');
  const { user_id, email, password, role } = getUserDataFromJwtToken(token);

  if (!(user_id && email && password && role)) {
    res.status(401);
    res.send({ data: null, error: { message: `Missing user data in token!` } });
    return;
  }

  const user = await getUser(user_id);

  if (!user) {
    res.status(401);
    res.send({ data: null, error: { message: `Not found user with id ${user_id}` } });
    return;
  }

  req.user = user;
  next();
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user.role !== 'admin') {
    res.status(403);
    res.send({ data: null, error: { message: 'Only admin users can delete user cart' } });
    return;
  }

  next();
};

function validateUserData(userData: { email: string; password: string; role: string }): ValidationResult<{ email: string; password: string; role: string }> {
  const schema = joi.object({
    email: joi.string()
      .email()
      .required(),

    password: joi.string()
      .min(5)
      .max(10)
      .required(),

    role: joi.string()
      .valid('admin', 'user')
      .required()
  });

  const { error, value } = schema.validate(userData);
  return { error, value };
};
