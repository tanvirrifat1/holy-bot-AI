import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { DashboardController } from './dashboard.controller';

const router = express.Router();

router.get(
  '/get-total-statistics',
  auth(USER_ROLES.ADMIN),
  DashboardController.totalStatistics
);

router.get(
  '/get-earning-chart-data',
  auth(USER_ROLES.ADMIN),
  DashboardController.getEarningChartData
);

export const DashboardRoutes = router;
