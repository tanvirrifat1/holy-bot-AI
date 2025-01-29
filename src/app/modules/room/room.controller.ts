import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { RoomService } from './room.service';

const getAllRooms = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await RoomService.getAllRooms(userId, req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Rooms retrieved successfully',
    data: result,
  });
});

const getRecentRooms = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await RoomService.getRecentRooms(userId, req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Rooms retrieved successfully',
    data: result,
  });
});

const getQuestionAndAns = catchAsync(async (req, res) => {
  const result = await RoomService.getQuestionAndAns(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Questions and Answers retrieved successfully',
    data: result,
  });
});

const deleteRoom = catchAsync(async (req, res) => {
  const result = await RoomService.deleteRoom(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Questions and Answers retrieved successfully',
    data: result,
  });
});

export const RoomController = {
  getAllRooms,
  getQuestionAndAns,
  getRecentRooms,
  deleteRoom,
};
