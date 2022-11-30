import { Request, Response } from 'express';
import argon2 from "argon2";
import crypto from 'crypto';

import {
    addUser,
    editUser,
    findAllStudents,
    findAllTutors,
    findAllUsers,
    findUserByEmail,
    findUserById,
} from './userService';
import { addAccountToken } from '../../authentication/emailAuth/authService';
import { sendMail } from '../../email/sendEmail';
import emailTemplates from '../../email/emailTemplates';
import { urls } from '../../constants/urls';

const createUser = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    try {
        //check if user exists
        const user = await findUserByEmail(email);
        if (user) return res.status(400).json({message: "user already exists"});
        //hash password
        const hashedPassword = await argon2.hash(password);
        //add user if user does not exist
        const record  = await addUser({firstName, lastName, email, password: hashedPassword, phoneNumber});
        //get userId
        const userObject = record?.toJSON();
        //Add activation token to db
        const token = crypto.randomBytes(32).toString('hex');
        await addAccountToken({token, UserId: Number(userObject.id)});
        //send email to user
        const url = `${urls.clientUrl}/auth/activation?token=${token}&id=${userObject.id}`;
        await sendMail({to: email, subject: 'Coding4U Account', html: emailTemplates.registration(firstName, 'Account Activation', url)});
       
        return res.status(201).json({record, message:"success"});
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const getUserMe =  async (req: Request, res: Response) => {
    const id = res.locals.userId;

    try {
        const user = await findUserById(Number(id));
        if (!user) return res.status(404).json({message: `user with id = ${id} does not exists`});
        return res.json(user);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }

}

const getAllUsers = async (req: Request, res: Response) => {
    let page = req.query?.page as number | undefined;
    let limit = req.query?.limit as number | undefined;
    //if page is undefined set default to 1
    if(!page) page = 1;
    //if limit is undefined set default to 10
    if(!limit) limit = 10;

    try {
        //Find users with pagination
        const users = await findAllUsers(page, limit);
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const getAllStudents = async (req: Request, res: Response) => {
    let page = req.query?.page as number | undefined;
    let limit = req.query?.limit as number | undefined;
    //if page is undefined set default to 1
    if(!page) page = 1;
    //if limit is undefined set default to 10
    if(!limit) limit = 10;

    try {
        //Find users with pagination
        const students = await findAllStudents(page, limit);
        return res.status(200).json(students);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const getAllTutors = async (req: Request, res: Response) => {
    let page = req.query?.page as number | undefined;
    let limit = req.query?.limit as number | undefined;
    //if page is undefined set default to 1
    if(!page) page = 1;
    //if limit is undefined set default to 10
    if(!limit) limit = 10;

    try {
        //Find users with pagination
        const tutors = await findAllTutors(page, limit);
        return res.status(200).json(tutors);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const getOneUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await findUserById(Number(id));
        if (!user) return res.status(404).json({message: `user with id = ${id} does not exists`});
        return res.json(user);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const updateUser =  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const user = await findUserById(Number(id));
        if (!user) return res.status(404).json({message: `user with id = ${id} does not exists`});
        
        await user.update({role});
        return res.status(200).json({message:"success"});
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }

}

const removeUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await findUserById(Number(id));
        if (!user) return res.status(404).json({message: `user with id = ${id} does not exists`});

        const deletedUser = await user.destroy();
        return res.json({record: deletedUser});
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}


export {
    createUser,
    getAllStudents,
    getAllTutors,
    getAllUsers,
    getOneUser,
    getUserMe,
    removeUser,
    updateUser
};