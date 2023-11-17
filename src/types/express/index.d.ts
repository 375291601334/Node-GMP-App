import { IUser } from '../../user';

export {}

declare global {
  namespace Express {
    export interface Request {
       user: IUser;
    }
  }
}