import express from 'express';

import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { RoomController } from './room.controller';

const router = express.Router();

router.get(
  '/get-all-rooms',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  RoomController.getAllRooms,
);

router.get(
  '/get-recent-rooms',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  RoomController.getRecentRooms,
);

router.get(
  '/get-all-ans/:id',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  RoomController.getQuestionAndAns,
);

router.delete(
  '/delete/:id',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  RoomController.deleteRoom,
);

export const RoomsRoutes = router;
