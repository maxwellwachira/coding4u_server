import sequelize from "sequelize";

import { ReferralModel } from "./referralsModel"; 

interface ReferralData {
    UserId: number;
    fullName: string;
    email: string;
    paid: boolean;
}

const addReferral = async ({ UserId, fullName, email,paid }: ReferralData) => {
    return await ReferralModel.create({
        UserId,
        fullName,
        email,
        paid
    });
}

const findAllReferrals = async (page: number, limit: number) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await ReferralModel.findAndCountAll({
        limit,
        offset,
        order: [['id', 'ASC']]
    });
    const totalPages = Math.ceil(count / limit);

    return {
        totalReferrals: count,
        totalPages,
        currentPage: page,
        referrals: rows
    };
}

const findAllReferralsByUser = async (page: number, limit: number , UserId: number) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await ReferralModel.findAndCountAll({
        where: {
            UserId
        },
        limit,
        offset,
        order: [['id', 'ASC']]
    });
    const totalPages = Math.ceil(count / limit);

    return {
        totalReferrals: count,
        totalPages,
        currentPage: page,
        referrals: rows
    };
}

const findReferralById = async (id: number) => {
    return await ReferralModel.findOne({
        where: {
            id, 
        }
    });
}

const findReferralByUserIdAndEmail = async (UserId: number, email: string) => {
    return await ReferralModel.findOne({
        where: {
            UserId, 
            email
        }
    });
}


export {
    addReferral,
    findAllReferrals,
    findAllReferralsByUser,
    findReferralById,
    findReferralByUserIdAndEmail
};