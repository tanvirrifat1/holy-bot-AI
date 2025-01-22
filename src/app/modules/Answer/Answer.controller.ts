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

export const AnswerController = {
  createAnswer,
};
