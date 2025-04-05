import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SettingService } from './setting.service';

// Terms and condition
const createTermsAndCondition = catchAsync(async (req, res) => {
  const result = await SettingService.createTermsAndCondition(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Terms-and-condition updated successfully',
    data: result,
  });
});

const getTermsAndCondition = catchAsync(async (req, res) => {
  const result = await SettingService.getTermsAndCondition();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Terms-and-condition retrieved successfully',
    data: result,
  });
});

// privacy and policy
const createPrivacyPolicy = catchAsync(async (req, res) => {
  const result = await SettingService.createPrivacyPolicy(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Privacy-policy updated successfully',
    data: result,
  });
});

const getPrivacyPolicy = catchAsync(async (req, res) => {
  const result = await SettingService.getPrivacyPolicy();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Privacy-policy retrieved successfully',
    data: result,
  });
});

// privacy and policy
const createTrustAndSafety = catchAsync(async (req, res) => {
  const result = await SettingService.createTrustAndSafety(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Trust-and-safety updated successfully',
    data: result,
  });
});

const getTrustAndSafety = catchAsync(async (req, res) => {
  const result = await SettingService.getTrustAndSafety();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Trust-and-safety retrieved successfully',
    data: result,
  });
});

export const SettingController = {
  createTermsAndCondition,
  getTermsAndCondition,
  createPrivacyPolicy,
  getPrivacyPolicy,
  createTrustAndSafety,
  getTrustAndSafety,
};
