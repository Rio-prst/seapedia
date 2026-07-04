import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { AccessTokenPayload } from '../types/jwt';

const JWT_SECRET: string = process.env.JWT_SECRET ?? '';
const JWT_EXPIRES_IN: SignOptions['expiresIn'] =
  (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) ?? '15m';

const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET env var is required');
}

export const signAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
};

export const generateRefreshToken = (): { raw: string; hash: string } => {
  const raw = crypto.randomBytes(40).toString('hex');
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, hash };
};

export const hashRefreshToken = (raw: string): string => {
  return crypto.createHash('sha256').update(raw).digest('hex');
};

export const getRefreshTokenExpiry = (): Date => {
  return new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
};
