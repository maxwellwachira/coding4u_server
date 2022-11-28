import express from 'express';

import authValidator from './authValidator';
import { validationMiddleware } from '../../middleware/validationMiddleware';
import { acountActivation, forgotPassword, passwordReset, refreshAccessToken, resendActivationToken, signIn } from './authController';

const router = express.Router();

//login
router.post('/sign-in', authValidator.checkUserLogin(), validationMiddleware, signIn);
//refresh token
router.post('/refresh', refreshAccessToken);
//Forgot password
router.post('/forgot-password',authValidator.checkUserForgotPassword(), validationMiddleware, forgotPassword);
//password reset
router.post('/password-reset',authValidator.checkUserPasswordReset(), validationMiddleware, passwordReset);
//activate account
router.post('/activate' ,authValidator.checkUserActivate(), validationMiddleware, acountActivation);

router.post('/resend-activation-token', resendActivationToken);

export default router;