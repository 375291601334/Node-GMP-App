import * as bcript from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JwtTokenData } from './entities';

const TOKEN_KEY = 'some_very_secret_string';

export const getEncryptedPassword = (password: string) => {
  const saltRounds = 10;
  return bcript.hash(password, saltRounds);
};

export const isPasswordValid = async (passwordToCheck: string, encryptedPassword: string) => {
  return await bcript.compare(passwordToCheck, encryptedPassword);
};

export const getJwtToken = (data: JwtTokenData): string => {
  return jwt.sign(
    data,
    TOKEN_KEY,
    { expiresIn: '2h' },
  );
};

export const getUserDataFromJwtToken = (token: string): JwtTokenData => {
  return jwt.verify(token, TOKEN_KEY) as JwtTokenData;
};
