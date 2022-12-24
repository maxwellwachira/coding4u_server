import express from 'express';

import {
    createSubscription,
    getAllSubscriptions,
    getOneSubscription,
    removeSubscription,
    updateSubscription
} from './newsletterController';


const router = express.Router();
//protected routes

//create subscription
router.post('/', createSubscription);
//Get all subscriptions
router.get('/', getAllSubscriptions);
//get one subscription
router.get('/:id', getOneSubscription);
//update subscription
router.put('/:id', updateSubscription);
//delete subscription
router.delete('/:id', removeSubscription);

export default router;