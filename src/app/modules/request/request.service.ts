import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IRequest } from './request.interface';
import { Request } from './request.model';

const createRequest = async (payload: IRequest) => {
  const result = await Request.create(payload);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Request doesn't exist!");
  }

  return result;
};

const getAllRequests = async (
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

const reactRequest = async (userId: string, query: Record<string, unknown>) => {
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
