import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IAnswer } from './Answer.interface';
import { Answer } from './Answer.model';
import { Request } from '../request/request.model';
import { Types } from 'mongoose';

const createAnswerToDB = async (
  user: string,
  payload: IAnswer
): Promise<IAnswer> => {
  const value = {
    answer: payload.answer,
    user: user,
    questionId: payload.questionId,
  };

  const isQuestion = await Request.findOne({ _id: payload.questionId });

  if (!isQuestion) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Question doesn't exist!");
  }

  const result = await Answer.create(value);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Answer doesn't exist!");
  }

  return result;
};

const getAllAnswers = async (questionId: string) => {
  const testResult = await Answer.find({
    questionId: new Types.ObjectId(questionId),
  });

  return testResult;
};

export const AnswerService = {
  createAnswerToDB,
  getAllAnswers,
};
