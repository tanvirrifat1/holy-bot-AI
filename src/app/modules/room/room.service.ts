import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Room } from './room.model';
import { Types } from 'mongoose';
import { Request } from '../request/request.model';

const getAllRooms = async (userId: string) => {
  const isExistQuestion = await Room.findOne({ user: userId });

  if (!isExistQuestion) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const testResult = await Room.find({
    user: new Types.ObjectId(userId),
  });

  return testResult;
};

const getQuestionAndAns = async (roomId: string) => {
  const testResult = await Request.find({
    room: new Types.ObjectId(roomId),
  });

  return testResult;
};

export const RoomService = {
  getAllRooms,
  getQuestionAndAns,
};
