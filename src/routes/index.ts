import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { RequestRoutes } from '../app/modules/request/request.route';
import { SettingRoutes } from '../app/modules/setting/setting.route';
import { PackageRoutes } from '../app/modules/package/package.route';
import { SubscriptionRoutes } from '../app/modules/subscriptions/subscriptions.route';
import { DashboardRoutes } from '../app/modules/dashboard/dashboard.route';
import { RoomsRoutes } from '../app/modules/room/room.route';
import { NotificationRoutes } from '../app/modules/Notification/Notification.route';

const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/request', route: RequestRoutes },
  { path: '/setting', route: SettingRoutes },
  { path: '/package', route: PackageRoutes },
  { path: '/subscription', route: SubscriptionRoutes },
  { path: '/dashboard', route: DashboardRoutes },
  { path: '/room', route: RoomsRoutes },
  { path: '/notification', route: NotificationRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
