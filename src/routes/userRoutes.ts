import express, { Router } from 'express';
import * as userController from '../controllers/userController';
//import verifyToken from '../middleware/verifyToken';

const router: Router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/change-password', userController.changePassword);
router.put('/update-profile',  userController.updateProfile);
router.delete('/delete-profile',  userController.deleteUser);
router.get('/profile', userController.seeProfileDetail);
router.get('/user-list', userController.getUserList);

export default router;
