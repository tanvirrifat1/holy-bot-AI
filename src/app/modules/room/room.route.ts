import express from 'express';

import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { RoomController } from './room.controller';

const router = express.Router();

router.get('/get-all-rooms', auth(USER_ROLES.USER), RoomController.getAllRooms);

router.get(
  '/get-all-ans/:id',
  auth(USER_ROLES.USER),
  RoomController.getQuestionAndAns
);

export const RoomsRoutes = router;
