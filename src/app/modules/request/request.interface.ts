import { Types } from 'mongoose';

export type IRequest = {
  _id: string;
  user: Types.ObjectId;
  question: string;
  answer: string;
  room: Types.ObjectId;
  createRoom: boolean;
  path?: string;
  fileQuestion?: string;
};
