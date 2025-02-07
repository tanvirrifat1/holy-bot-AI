import { Types } from 'mongoose';

export type IRoom = {
  roomName?: string;
  user: Types.ObjectId;
  questions: Types.ObjectId[];
  path?: string;
};
