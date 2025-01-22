import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { RequestRoutes } from '../app/modules/request/request.route';
import { AnswerRoutes } from '../app/modules/Answer/Answer.route';
import { SettingRoutes } from '../app/modules/setting/setting.route';
import { PackageRoutes } from '../app/modules/package/package.route';

const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/request', route: RequestRoutes },
  { path: '/answer', route: AnswerRoutes },
  { path: '/setting', route: SettingRoutes },
  { path: '/package', route: PackageRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
