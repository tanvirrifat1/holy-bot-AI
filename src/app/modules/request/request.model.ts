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
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
    },
    createRoom: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Request = model<IRequest>('Question', questionSchema);
