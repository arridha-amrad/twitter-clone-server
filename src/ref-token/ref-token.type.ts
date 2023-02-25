export type TSaveRefToken = {
  userId: string;
  token: string;
};

export type TPutRefToke = {
  id: string;
  value: string;
};

export type TRefTokenPayload = {
  username: string;
  sub: string;
  iat: number;
  exp: number;
  iss: string;
  jti: string;
};
