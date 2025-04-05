import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { SubscriptionController } from './subscriptions.controller';

const router = Router();

router.post(
  '/check-out',
  auth(USER_ROLES.USER),
  SubscriptionController.createCheckoutSessionController
);

router.get(
  '/get-subs-admin',
  auth(USER_ROLES.ADMIN),
  SubscriptionController.getAllSubs
);

router.get(
  '/get-all',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  SubscriptionController.getAllSubscriptions
);

router.patch(
  '/updated',
  auth(USER_ROLES.USER),
  SubscriptionController.updateSubs
);

router.delete(
  '/cancel',
  auth(USER_ROLES.USER),
  SubscriptionController.cancelSubscriptions
);

export const SubscriptionRoutes = router;
