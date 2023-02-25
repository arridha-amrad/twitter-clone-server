import { User } from '.prisma/client';

export type TLoginRequestDTO = {
  identity: string;
  password: string;
};

export type TLoginResponseDTO = {
  user: Omit<User, 'password'>;
  token: string;
};
