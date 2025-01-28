import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IRequest } from './request.interface';
import { Request } from './request.model';
import { Room } from '../room/room.model';
import { generateRoomId } from './requestion.contant';

// const createRequest = async (payload: IRequest) => {
//   // Create the Q&A request
//   const result = await Request.create(payload);

//   if (!result) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, "Request couldn't be created!");
//   }

//   if (payload.createRoom) {
//     console.log(payload.createRoom);
//     // Create a new room for the user
//     try {
//       const newRoom = await Room.create({
//         user: result.user,
//         questions: [result.question],
//         roomName: `Room-${result.user}-${Date.now()}`,
//       });

//       // Link the room to the request
//       result.room = newRoom._id;
//       await result.save();

//       console.log('New Room Created:', newRoom);
//       return { request: result, room: newRoom };
//     } catch (error) {
//       console.error('Error creating room:', error);
//       throw new ApiError(
//         StatusCodes.BAD_REQUEST,
//         'Failed to create a new room!'
//       );
//     }
//   }

//   // Check if a room already exists for the user
//   let existingRoom = await Room.findOne({ user: result.user });

//   if (!existingRoom) {
//     // If no room exists, create a new one
//     existingRoom = await Room.create({
//       user: result.user,
//       questions: [result.question],
//       roomName: `Room-${result.user}-${Date.now()}`,
//     });

//     // Link the room to the request
//     result.room = existingRoom._id;
//     await result.save();

//     console.log('New Room Created:', existingRoom);
//   } else {
//     // Add the question to the existing room
//     existingRoom.questions.push(result.question);
//     await existingRoom.save();

//     console.log('Question added to existing room:', existingRoom);
//   }

//   return { request: result, room: existingRoom };
// };

const createRequest = async (payload: IRequest) => {
  let roomId;
  let room: any;
  console.log(payload);

  if (payload.room) {
    // Check if the payload contains a room ID and find the existing room
    room = await Room.findOne({ roomName: payload.room });

    if (room) {
      roomId = room.roomName; // Use the existing room ID
    } else {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found!');
    }
  } else if (!payload.createRoom) {
    // If no room ID provided, check if createRoom is false and try to find an existing room for the user
    room = await Room.findOne({ user: payload.user }).sort({ createdAt: -1 });

    if (room) {
      roomId = room.roomName; // Use the existing room ID
    }
  }

  // If no existing room found or if createNewRoom is true, create a new room
  if (!room || payload.createRoom) {
    roomId = await generateRoomId();

    // Create a new room for the user
    room = await Room.create({
      user: payload.user,
      questions: [payload._id], // Add the first question to the new room
      roomName: payload.question.toString().slice(0, 20) + roomId,
    });
  }

  // Create a new question and answer and associate it with the room
  const result = await Request.create({ ...payload, room: room._id });

  if (result) {
    // Add the new question to the room's questions array
    room.questions.push(result._id);
    await room.save(); // Save the updated room
  }

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

  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  anyConditions.push({ createdAt: { $gte: oneDayAgo } });

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

const getAllRequestsForAdmin = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;
  const anyConditions: any[] = [];

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
