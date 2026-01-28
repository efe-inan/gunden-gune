import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/config';

export const generateToken = (userId: string, email: string): string => {
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn,
  };
  return jwt.sign({ userId, email }, config.jwtSecret, options);
};

export const generateRefreshToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: config.jwtRefreshExpiresIn,
  };
  return jwt.sign({ userId }, config.jwtRefreshSecret, options);
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.jwtSecret);
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, config.jwtRefreshSecret);
};
