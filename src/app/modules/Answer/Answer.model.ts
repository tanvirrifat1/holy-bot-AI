import { model, Schema } from 'mongoose';
import { IAnswer } from './Answer.interface';

const answerSchema = new Schema<IAnswer>(
  {
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

export const Answer = model<IAnswer>('Answer', answerSchema);
