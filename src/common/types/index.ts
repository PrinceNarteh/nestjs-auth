import { Request } from 'express';
import { User } from 'src/database/schemas';

export type RequestWithUser = Request & {
  user: User;
};

export type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};
