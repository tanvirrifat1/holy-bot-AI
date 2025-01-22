import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { SubscriptionController } from './subscriptation.controller';

const router = Router();

router.post(
  '/check-out',
  auth(USER_ROLES.USER),
  SubscriptionController.createCheckoutSessionController
);

router.get('/get-subs', SubscriptionController.getAllSubs);

router.get(
  '/get-all',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  SubscriptionController.getAllSubscriptation
);

router.patch(
  '/updated',
  auth(USER_ROLES.USER),
  SubscriptionController.updateSubs
);

router.delete(
  '/cancel',
  auth(USER_ROLES.USER),
  SubscriptionController.cancelSubscriptation
);

export const SubscriptionRoutes = router;
