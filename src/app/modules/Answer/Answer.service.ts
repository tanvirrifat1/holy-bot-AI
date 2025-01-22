import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IAnswer } from './Answer.interface';
import { Answer } from './Answer.model';

const createAnswerToDB = async (
  user: string,
  payload: IAnswer
): Promise<IAnswer> => {
  const value = {
    answer: payload.answer,
    user: user,
    questionId: payload.questionId,
  };

  const result = await Answer.create(value);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Answer doesn't exist!");
  }

  return result;
};

export const AnswerService = {
  createAnswerToDB,
};
