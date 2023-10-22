import { IUser } from '../../user';

export {}

declare global {
  namespace Express {
    export interface Request {
       userId: IUser['id'];
    }
  }
}