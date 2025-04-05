import { Types } from 'mongoose';

export type IRoom = {
  roomName?: string;
  user: Types.ObjectId;
  path?: string;
};
