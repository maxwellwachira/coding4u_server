import { Request, Response } from 'express';

import {
    addReferral,
    findAllReferrals,
    findAllReferralsByUser,
    findReferralById,
    findReferralByUserIdAndEmail
} from './referralsService';


const getAllReferrals = async (req: Request, res: Response) => {
    let page = req.query?.page as number | undefined;
    let limit = req.query?.limit as number | undefined;
    //if page is undefined set default to 1
    if(!page) page = 1;
    //if limit is undefined set default to 10
    if(!limit) limit = 10;

    try {
        //Find referrals with pagination
        const referrals = await findAllReferrals(page, limit);
        return res.status(200).json(referrals);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const getAllReferralsByUser = async (req: Request, res: Response) => {
    let page = req.query?.page as number | undefined;
    let limit = req.query?.limit as number | undefined;
    const id = res.locals.userId;
    //if page is undefined set default to 1
    if(!page) page = 1;
    //if limit is undefined set default to 10
    if(!limit) limit = 10;

    try {
        //Find referrals with pagination
        const referrals = await findAllReferralsByUser(page, limit, Number(id));
        return res.status(200).json(referrals);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const getOneReferral = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const referral = await findReferralById(Number(id));
        if (!referral) return res.status(404).json({message: `referral with id = ${id} does not exists`});
        return res.json(referral);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const updateReferral =  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { paid } = req.body;

    try {
        const referral = await findReferralById(Number(id));
        if (!referral) return res.status(404).json({message: `referral with id = ${id} does not exists`});
        //get referral object
        referral.set({paid});
        await referral.save();
        return res.status(200).json({message:"success"});
        
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }

}

const removeReferral = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const referral = await findReferralById(Number(id));
        if (!referral) return res.status(404).json({message: `referral with id = ${id} does not exists`});

        const deletedreferral = await referral.destroy();
        return res.json({record: deletedreferral});
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

export {
    getAllReferrals,
    getAllReferralsByUser,
    getOneReferral,
    removeReferral,
    updateReferral
};