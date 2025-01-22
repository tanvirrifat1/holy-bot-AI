import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AnswerService } from './Answer.service';

const createAnswer = catchAsync(async (req, res) => {
  const user = req.user.id;

  const result = await AnswerService.createAnswerToDB(user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Answer created successfully',
    data: result,
  });
});

const getAllAnswers = catchAsync(async (req, res) => {
  const result = await AnswerService.getAllAnswers(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Answer retrieved successfully',
    data: result,
  });
});

export const AnswerController = {
  createAnswer,
  getAllAnswers,
};
