import catchAsync from '../../../shared/catchAsync';
import { SettingService } from './setting.service';

// Terms and condition
const createTermsAndCondition = catchAsync(async (req, res) => {
  const result = await SettingService.createTermsAndCondition(req.body);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Terms-and-condition updated successfully',
    data: result,
  });
});

const getTermsAndCondition = catchAsync(async (req, res) => {
  const result = await SettingService.getTermsAndCondition();
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Terms-and-condition retrived successfully',
    data: result,
  });
});

// privacy and policy
const createPrivacyPolicy = catchAsync(async (req, res) => {
  const result = await SettingService.createPrivacyPolicy(req.body);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Privacy-policy updated successfully',
    data: result,
  });
});

const getPrivacyPolicy = catchAsync(async (req, res) => {
  const result = await SettingService.getPrivacyPolicy();
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Privacy-policy retrived successfully',
    data: result,
  });
});

// privacy and policy
const createTrustAndSafety = catchAsync(async (req, res) => {
  const result = await SettingService.createTrustAndSafety(req.body);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Trust-and-safety updated successfully',
    data: result,
  });
});

const getTrustAndSafety = catchAsync(async (req, res) => {
  const result = await SettingService.getTrustAndSafety();
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Trust-and-safety retrived successfully',
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
