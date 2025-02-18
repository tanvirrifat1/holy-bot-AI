"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const package_controller_1 = require("./package.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post('/create-package', (0, auth_1.default)(user_1.USER_ROLES.ADMIN), package_controller_1.packageController.createPlanToDB);
router.patch('/update/:id', (0, auth_1.default)(user_1.USER_ROLES.ADMIN), package_controller_1.packageController.updatePackage);
router.get('/get-all-packages', package_controller_1.packageController.getAllPackage);
router.get('/:id', package_controller_1.packageController.getSinglePackage);
router.delete('/delete/:id', (0, auth_1.default)(user_1.USER_ROLES.ADMIN), package_controller_1.packageController.deletePackage);
exports.PackageRoutes = router;
