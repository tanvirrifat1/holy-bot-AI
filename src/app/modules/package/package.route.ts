import express from 'express';
import { packageController } from './package.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create-package',
  auth(USER_ROLES.ADMIN),
  packageController.createPlanToDB
);

router.patch(
  '/update/:id',
  auth(USER_ROLES.ADMIN),
  packageController.updatePackage
);

router.get('/get-all-packages', packageController.getAllPackage);

router.get('/:id', packageController.getSinglePackage);

router.delete(
  '/delete/:id',
  auth(USER_ROLES.ADMIN),
  packageController.deletePackage
);

export const PackageRoutes = router;
