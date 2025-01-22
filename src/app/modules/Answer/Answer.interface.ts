import { Types } from 'mongoose';

export type IAnswer = {
  questionId: Types.ObjectId;
  answer: string;
  user: Types.ObjectId;
};
