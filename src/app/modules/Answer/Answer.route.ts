import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { AnswerController } from './Answer.controller';

const router = express.Router();

router.post('/create', auth(USER_ROLES.USER), AnswerController.createAnswer);

router.get(
  '/get-all-answer/:id',
  auth(USER_ROLES.USER),
  AnswerController.getAllAnswers
);

// router.get(
//   '/get-all-admin',
//   auth(USER_ROLES.ADMIN),
//   RequestController.getAllRequestsForAdmin
// );

// router.get(
//   '/get/:id',
//   auth(USER_ROLES.USER),
//   RequestController.getSingleRequest
// );

// router.delete(
//   '/delete/:id',
//   auth(USER_ROLES.USER),
//   RequestController.deleteRequest
// );

export const AnswerRoutes = router;
