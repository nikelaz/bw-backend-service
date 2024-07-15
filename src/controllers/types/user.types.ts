import { User } from '../../models/user';

export interface IUserBody {
  user: Partial<User>;
};

export interface IUserReply {
  user: Partial<User>;
};

export interface ILoginReply {
  token: string;
  user: Partial<User>;
};
