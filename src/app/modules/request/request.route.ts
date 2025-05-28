import express from 'express';
import { RequestController } from './request.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  RequestController.createRequest,
);

router.get(
  '/get-all/:id',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  RequestController.getAllRequests,
);

router.get(
  '/get-recent/:id',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  RequestController.reactRequest,
);

router.get(
  '/get-req-history',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  RequestController.getAllRequestsHistory,
);

router.get(
  '/get-all-admin',
  auth(USER_ROLES.ADMIN),
  RequestController.getAllRequestsForAdmin,
);

router.get(
  '/get/:id',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  RequestController.getSingleRequest,
);

router.delete(
  '/delete/:id',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  RequestController.deleteRequest,
);

router.get('/get-for-all', RequestController.getAllRequestsHistoryForAll);

export const RequestRoutes = router;
