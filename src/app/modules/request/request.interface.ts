import { Types } from 'mongoose';

export type IRequest = {
  question: string;
  user: Types.ObjectId;
};
