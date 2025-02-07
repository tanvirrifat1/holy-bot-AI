import { model, Schema } from 'mongoose';
import { IRoom } from './room.interface';

const questionSchema = new Schema<IRoom>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    roomName: {
      type: String,
      required: true,
    },
    path: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Room = model<IRoom>('Room', questionSchema);
