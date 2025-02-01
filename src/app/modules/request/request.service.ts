import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IRequest } from './request.interface';
import { Request } from './request.model';
import { Room } from '../room/room.model';
import { generateRoomId } from './requestion.contant';
import moment from 'moment';
import { User } from '../user/user.model';

const createRequest = async (payload: IRequest) => {
  let roomId;
  let room: any;

  if (payload.room) {
    room = await Room.findOne({ roomName: payload.room });

    if (room) {
      roomId = room.roomName;
    } else {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found!');
    }
  } else if (!payload.createRoom) {
    room = await Room.findOne({ user: payload.user }).sort({ createdAt: -1 });

    if (room) {
      roomId = room.roomName;
    }
  }

  if (!room || payload.createRoom) {
    const formattedDate = moment().format('HH:mm:ss');
    room = await Room.create({
      user: payload.user,
      // questions: [payload._id],
      // roomName: payload.question,
      roomName: `${payload.question}-${formattedDate}`,
    });
  }

  const result = await Request.create({ ...payload, room: room._id });

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Request couldn't be created!");
  }

  return result;
};

const getAllRequests = async (
  roomId: string,
  query: Record<string, unknown>
) => {
  const isExistRoom = await Room.findById(roomId);
  if (!isExistRoom) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found!');
  }

  const { page, limit, searchTerm, ...filterData } = query;
  const anyConditions: any[] = [];

  anyConditions.push({ room: roomId });

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

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Request.find(whereConditions)
    .populate({
      path: 'room',
      select: 'roomName',
    })
    // .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Request.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

const reactRequest = async (roomId: string, query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;

  const isExistRoom = await Room.findById(roomId);
  if (!isExistRoom) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found!');
  }

  const anyConditions: any[] = [];

  anyConditions.push({ room: roomId });

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

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Request.find(whereConditions)
    .populate({
      path: 'room',
      select: 'roomName',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Request.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

const getAllRequestsForAdmin = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, email, ...filterData } = query;
  const anyConditions: any[] = [];

  if (email) {
    const emailIds = await User.find({
      email: { $regex: email, $options: 'i' },
    }).distinct('_id');

    if (emailIds.length > 0) {
      anyConditions.push({ user: { $in: emailIds } });
    }
  }

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

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Request.find(whereConditions)
    .populate('user')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Request.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

const getSingleRequest = async (id: string) => {
  const isExistRequest = await Request.findById(id);
  if (!isExistRequest) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Request doesn't exist!");
  }

  const result = await Request.findById(id);
  return result;
};
const deleteRequest = async (id: string) => {
  const isExistRequest = await Request.findById(id);
  if (!isExistRequest) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Request doesn't exist!");
  }

  const result = await Request.findByIdAndDelete(id);
  return result;
};

const getAllRequestsHistory = async (
  userId: string,
  query: Record<string, unknown>
) => {
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

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Request.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Request.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

export const RequestService = {
  createRequest,
  getAllRequests,
  getAllRequestsForAdmin,
  deleteRequest,
  getSingleRequest,
  reactRequest,
  getAllRequestsHistory,
};
