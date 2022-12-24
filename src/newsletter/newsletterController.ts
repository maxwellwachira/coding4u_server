import { Request, Response } from 'express';

import {
    subscribeToNewsletter,
    findAllSubscriptions,
    findSubscriptionById,
    findSubscriptionByEmail,
} from './newsletterService';

const createSubscription = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        //check if subscription exists
        const subscription = await findSubscriptionByEmail(email.toLowerCase());
        if (subscription) return res.status(400).json({message: "subscription already exists"});
        //Add subscription if does not exists
        const record  = await subscribeToNewsletter({email: email.toLowerCase()});
        return res.status(201).json({record, message:"success"});
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const getAllSubscriptions = async (req: Request, res: Response) => {
    let page = req.query?.page as number | undefined;
    let limit = req.query?.limit as number | undefined;
    //if page is undefined set default to 1
    if(!page) page = 1;
    //if limit is undefined set default to 10
    if(!limit) limit = 10;

    try {
        //Find subscriptions with pagination
        const subscriptions = await findAllSubscriptions(page, limit);
        return res.status(200).json(subscriptions);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}



const getOneSubscription = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const subscription = await findSubscriptionById(Number(id));
        if (!subscription) return res.status(404).json({message: `subscription with id = ${id} does not exists`});
        return res.json(subscription);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const updateSubscription =  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { subscribed } = req.body;

    try {
        const subscription = await findSubscriptionById(Number(id));
        if (!subscription) return res.status(404).json({message: `subscription with id = ${id} does not exists`});
    
        subscription.update({subscribed});
        return res.status(200).json({message:"success"});
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }

}

const removeSubscription = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const subscription = await findSubscriptionById(Number(id));
        if (!subscription) return res.status(404).json({message: `subscription with id = ${id} does not exists`});

        const deletedsubscription = await subscription.destroy();
        return res.json({record: deletedsubscription});
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}


export {
    createSubscription,
    getAllSubscriptions,
    getOneSubscription,
    removeSubscription,
    updateSubscription
};