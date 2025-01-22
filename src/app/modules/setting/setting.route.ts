import express from 'express';
import { SettingController } from './setting.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

// Terms and condition
router.post(
  '/create-terms',
  auth(USER_ROLES.ADMIN),
  SettingController.createTermsAndCondition
);
router.get('/get-terms', SettingController.getTermsAndCondition);

// Privacy Policy
router.post(
  '/create-privacy',
  auth(USER_ROLES.ADMIN),
  SettingController.createPrivacyPolicy
);
router.get('/get-privacy', SettingController.getPrivacyPolicy);

// Trust & Safety
router.post(
  '/create-trust',
  auth(USER_ROLES.ADMIN),
  SettingController.createTrustAndSafety
);
router.get('/get-trust', SettingController.getTrustAndSafety);

export const SettingRoutes = router;
