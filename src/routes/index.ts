import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { RequestRoutes } from '../app/modules/request/request.route';
import { AnswerRoutes } from '../app/modules/Answer/Answer.route';

const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/request', route: RequestRoutes },
  { path: '/answer', route: AnswerRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
