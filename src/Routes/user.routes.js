import express from 'express';
import userController from '../Controller/user.controller.js';

const router = express.Router();

router.post('/signupUser', userController.signupUser);
router.post('/activateAccount/:token', userController.activateAccount)
router.post('/loginUser', userController.loginUser)
router.post('/forgotPassword', userController.forgotPassword)
router.post('/resetPassword/:token', userController.resetPassword)

export default router