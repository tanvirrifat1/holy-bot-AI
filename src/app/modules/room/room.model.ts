import { model, Schema } from 'mongoose';
import { IRoom } from './room.interface';

const questionSchema = new Schema<IRoom>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    // questions: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Question',
    //   },
    // ],
    roomName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Room = model<IRoom>('Room', questionSchema);
