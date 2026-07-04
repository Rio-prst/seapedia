import bcrypt from 'bcrypt';
import {
  findUserByEmail,
  createUserWithDefaultRole,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
} from './auth.repository';
import { RegisterInput, LoginInput } from './auth.types';
import { signAccessToken, generateRefreshToken, hashRefreshToken, getRefreshTokenExpiry } from '../../utils/jwt';

export const registerUser = async (input: RegisterInput) => {
  const existing = await findUserByEmail(input.email);
  if (existing) throw new Error('Email already registered');

  const passwordHash = await bcrypt.hash(input.password, 10);
  return createUserWithDefaultRole(input.username, input.email, passwordHash);
};

export const loginUser = async (input: LoginInput) => {
  const user = await findUserByEmail(input.email);
  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw new Error('Invalid credentials');

  const accessToken = signAccessToken({ userId: user.id });
  const { raw, hash } = generateRefreshToken();
  await saveRefreshToken(user.id, hash, getRefreshTokenExpiry());

  return {
    accessToken,
    refreshToken: raw,
    user: { id: user.id, username: user.username, email: user.email },
  };
};

export const refreshUserToken = async (rawRefreshToken: string) => {
  const hash = hashRefreshToken(rawRefreshToken);
  const stored = await findRefreshToken(hash);
  if (!stored) throw new Error('Invalid refresh token');

  if (stored.expiresAt < new Date()) {
    await deleteRefreshToken(hash);
    throw new Error('Refresh token expired');
  }

  await deleteRefreshToken(hash);

  const accessToken = signAccessToken({ userId: stored.userId });
  const { raw, hash: newHash } = generateRefreshToken();
  await saveRefreshToken(stored.userId, newHash, getRefreshTokenExpiry());

  return { accessToken, refreshToken: raw };
};

export const logoutUser = async (rawRefreshToken: string) => {
  const hash = hashRefreshToken(rawRefreshToken);
  await deleteRefreshToken(hash);
};
