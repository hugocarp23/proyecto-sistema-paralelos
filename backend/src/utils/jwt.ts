import jwt, { Secret } from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export interface TokenPayload {
  id: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, ENV.JWT_SECRET as Secret, {
    expiresIn: ENV.JWT_EXPIRES_IN as unknown as number,
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, ENV.JWT_SECRET as Secret) as TokenPayload;
}
