import express from 'express';

import {
    getAllReferrals,
    getAllReferralsByUser,
    getOneReferral,
    removeReferral,
    updateReferral
} from './referralsController';

import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

//protected routes
//router.use(authMiddleware);

//Get all referrals
router.get('/', getAllReferrals);
//get my referrals
router.get('/my-referrals', authMiddleware, getAllReferralsByUser);
//get one referral
router.get('/:id', getOneReferral);
//update referral
router.put('/:id', updateReferral);
//delete referral
router.delete('/:id', removeReferral);

export default router;