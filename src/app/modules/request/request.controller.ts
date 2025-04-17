import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { RequestService } from './request.service';

const createRequest = catchAsync(async (req, res) => {
  const user = req.user.id;
  const value = {
    user,
    ...req.body,
  };

  const result = await RequestService.createRequest(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Request created successfully',
    data: result,
  });
});

const getAllRequests = catchAsync(async (req, res) => {
  const result = await RequestService.getAllRequests(req.params.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Request retrieved successfully',
    data: result,
  });
});

const reactRequest = catchAsync(async (req, res) => {
  const result = await RequestService.reactRequest(req.params.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Request retrieved successfully',
    data: result,
  });
});

const getAllRequestsForAdmin = catchAsync(async (req, res) => {
  const result = await RequestService.getAllRequestsForAdmin(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Request retrieved successfully',
    data: result,
  });
});

const getSingleRequest = catchAsync(async (req, res) => {
  const result = await RequestService.getSingleRequest(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Single Request retrieved successfully',
    data: result,
  });
});

const deleteRequest = catchAsync(async (req, res) => {
  const result = await RequestService.deleteRequest(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Request deleted successfully',
    data: result,
  });
});

const getAllRequestsHistory = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await RequestService.getAllRequestsHistory(userId, req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Questions retrieved successfully',
    data: result,
  });
});

const getAllRequestsHistoryForAll = catchAsync(async (req, res) => {
  const result = await RequestService.getAllRequestsHistoryForAll(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Questions retrieved successfully',
    data: result,
  });
});

export const RequestController = {
  createRequest,
  getAllRequests,
  getAllRequestsForAdmin,
  deleteRequest,
  getSingleRequest,
  reactRequest,
  getAllRequestsHistory,
  getAllRequestsHistoryForAll,
};
