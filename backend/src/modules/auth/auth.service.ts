import bcrypt from 'bcrypt';
import { findUserByEmail, createUserWithDefaultRole } from './auth.repository';
import { RegisterInput, LoginInput } from './auth.types';
import { signToken } from '../../utils/jwt';

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

  const token = signToken({ userId: user.id });

  return { token, user: { id: user.id, username: user.username, email: user.email } };
};