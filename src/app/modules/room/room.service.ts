import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Room } from './room.model';
import { Types } from 'mongoose';
import { Request } from '../request/request.model';
import { User } from '../user/user.model';

const getQuestionAndAns = async (roomId: string) => {
  const testResult = await Request.find({
    room: new Types.ObjectId(roomId),
  });

  return testResult;
};

const getAllRooms = async (userId: string, query: Record<string, unknown>) => {
  const isExistUser = await User.findById(userId);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  const { page, limit, searchTerm, ...filterData } = query;
  const anyConditions: any[] = [];

  anyConditions.push({ user: userId });

  if (searchTerm) {
    anyConditions.push({
      $or: [{ question: { $regex: searchTerm, $options: 'i' } }],
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  // Filter for requests created more than 24 hours ago
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  anyConditions.push({ createdAt: { $lt: oneDayAgo } });

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Room.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Room.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

const getRecentRooms = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const isExistUser = await User.findById(userId);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  const { page, limit, searchTerm, ...filterData } = query;
  const anyConditions: any[] = [];

  anyConditions.push({ user: userId });

  if (searchTerm) {
    anyConditions.push({
      $or: [{ question: { $regex: searchTerm, $options: 'i' } }],
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  // Filter for requests created more than 24 hours ago
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  anyConditions.push({ createdAt: { $gte: oneDayAgo } });

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Room.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Room.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

const deleteRoom = async (roomId: string) => {
  const isRoom = await Room.findByIdAndDelete(roomId);
  if (!isRoom) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found!');
  }

  await Request.deleteMany({ room: roomId });

  return isRoom;
};

export const RoomService = {
  getAllRooms,
  getQuestionAndAns,
  getRecentRooms,
  deleteRoom,
};
