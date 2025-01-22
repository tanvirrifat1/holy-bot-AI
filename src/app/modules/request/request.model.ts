import { model, Schema } from 'mongoose';
import { IRequest } from './request.interface';

const questionSchema = new Schema<IRequest>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const Request = model<IRequest>('Question', questionSchema);
