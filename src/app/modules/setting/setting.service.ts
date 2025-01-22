import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IPrivacy, ITerms, ITrust } from './setting.interface';
import { Privacy, TermsAndCondition, Trust } from './setting.model';

// Terms and conditions
const createTermsAndCondition = async (payload: Partial<ITerms>) => {
  try {
    const existingTerm = await TermsAndCondition.findOne();

    if (existingTerm) {
      Object.assign(existingTerm, payload);
      const updatedTerm = await existingTerm.save();
      return updatedTerm;
    } else {
      const newTerm = await TermsAndCondition.create(payload);
      return newTerm;
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Unable to create or update terms and condition.'
    );
  }
};

const getTermsAndCondition = async () => {
  const term = await TermsAndCondition.findOne();
  if (!term) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Terms and condition not found.');
  }
  return term;
};

// Privacy policy
const createPrivacyPolicy = async (payload: Partial<IPrivacy>) => {
  try {
    const existingTerm = await Privacy.findOne();

    if (existingTerm) {
      Object.assign(existingTerm, payload);
      const updatedTerm = await existingTerm.save();
      return updatedTerm;
    } else {
      const newTerm = await Privacy.create(payload);
      return newTerm;
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Unable to create or update privacy policy.'
    );
  }
};

const getPrivacyPolicy = async () => {
  const term = await TermsAndCondition.findOne();
  if (!term) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Privacy policy not found.');
  }
  return term;
};

// Trust & Safety
const createTrustAndSafety = async (payload: Partial<ITrust>) => {
  try {
    const existingTerm = await Trust.findOne();

    if (existingTerm) {
      Object.assign(existingTerm, payload);
      const updatedTerm = await existingTerm.save();
      return updatedTerm;
    } else {
      const newTerm = await Privacy.create(payload);
      return newTerm;
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Unable to create or update trust and safety.'
    );
  }
};

const getTrustAndSafety = async () => {
  const term = await Trust.findOne();
  if (!term) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Trust and safety not found.');
  }
  return term;
};

export const SettingService = {
  createTermsAndCondition,
  getTermsAndCondition,
  createPrivacyPolicy,
  getPrivacyPolicy,
  createTrustAndSafety,
  getTrustAndSafety,
};
