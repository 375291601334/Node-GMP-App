import { User } from '../../types';

export {}

declare global {
  namespace Express {
    export interface Request {
       userId: User['id'];
    }
  }
}