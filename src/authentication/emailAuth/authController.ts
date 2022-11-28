import { Request, Response } from "express";
import argon2 from "argon2";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import crypto from "crypto";
import moment from "moment";
import dotenv from 'dotenv';

import { addToken,findToken, findAccountToken, addAccountToken } from "./authService"
import { findUserByEmail, findUserById } from "../../appUsers/users/userService";
import { sendMail } from "../../email/sendEmail";
import emailTemplates from "../../email/emailTemplates";
import { urls } from "../../constants/urls";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as Secret;
const EXPIRE_TIME = process.env.EXPIRE_TIME;
const REFRESH_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET as Secret;
const REFRESH_EXPIRE_TIME = process.env.REFRESH_EXPIRE_TIME;

const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        //check if user already exists otherwise return error message
        const existingUser =  await findUserByEmail(email);
        if(!existingUser) return res.status(404).json({message: `user with email ${email} does not exists`});
        //check if the entered password is OK to the save password otherwise return error message
        const { id, email: userEmail, password: userPassword} = existingUser.toJSON();
        const isPasswordCorrect = await argon2.verify(userPassword, password);
        if (!isPasswordCorrect) return res.status(400).json({message: "wrong password"});
        //return tokens to user
        const accessToken = jwt.sign({ email: userEmail, id }, SECRET_KEY, { expiresIn: EXPIRE_TIME }); 
        const refreshToken = jwt.sign({ email: userEmail, id }, REFRESH_SECRET_KEY, { expiresIn: REFRESH_EXPIRE_TIME }); 
        return res.status(200).json({ message: "success", accessToken,  refreshToken});

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "error", error});
    }
}

const refreshAccessToken = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({message: "unauthorized"});

    try {
        const decodeData = jwt.verify(token, REFRESH_SECRET_KEY) as JwtPayload;
        //get user from decodedData information
        const user = await findUserById(decodeData?.id);
        if(!user) return res.status(404).json({message: "user does not exists"});
        const { id, email } = user.toJSON();
        //return new access token and the same refresh token to the user to the user
        const accessToken = jwt.sign({ email, id }, SECRET_KEY, { expiresIn: EXPIRE_TIME }); 
        return res.status(200).json({ accessToken, refreshToken: token });
    } catch (error) {
        console.log(error)
        return res.status(401).json({message: "invalid Token"});
    }
}

const forgotPassword =  async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
       //check if user already exists otherwise return error message
       const existingUser =  await findUserByEmail(email);
       if(!existingUser) return res.status(404).json({message: `user with email ${email} does not exists`}); 
       //Extract user id from object and add token to db
       const { id: UserId, firstName } = existingUser.toJSON();
       //generate token
       const token = crypto.randomBytes(32).toString('hex');
       //add token to db
       const record  = await addToken({token, UserId});
       //Send Email, url to have token and Userid
       const url = `${urls.clientUrl}/auth/reset-password?token=${token}&email=${email}&id=${UserId}`;
       await sendMail({to: email, subject: 'Password Recovery', html: emailTemplates.passwordReset(firstName, 'Password Recovery', url)});

       return res.status(201).json({record, message:"success"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"server error", error});
    }
}

const resendActivationToken =  async (req: Request, res: Response) => {

    const { UserId } = req.body;
    const id = Number(UserId);
    try {
       //check if user already exists otherwise return error message
       const existingUser =  await findUserById(id);
       if(!existingUser) return res.status(404).json({message: "user does not exists"}); 
       //Extract user id from object and add token to db
       const { id: UserId, firstName, email, active } = existingUser.toJSON();
       if (active) return res.status(404).json({message: "user account already active"});

       //generate token
       const token = crypto.randomBytes(32).toString('hex');
       //add token to db
       const record  = await addAccountToken({token, UserId});
       //Send Email, url to have token and Userid
       const url = `${urls.clientUrl}/auth/activation?token=${token}&id=${id}`;
       await sendMail({to: email, subject: 'Account Activation', html: emailTemplates.registration(firstName, 'Account Activation', url)});

       return res.status(201).json({record, message:"success"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"error", error});
    }
}

const acountActivation =  async (req: Request, res: Response) => {
    const { token, UserId  } =  req.body;
    if (!token) return res.status(400).json({message:"undefined reset token"});

    try {
        //Updating user password logic
        const user = await findUserById(UserId);
        if (!user) return res.status(404).json({message: "user does not exists"}); 
        //user object
        const { active } = user?.toJSON();
        if (active) return res.status(404).json({message: "user account already active"});

        const accountToken = await findAccountToken({ token, UserId });
        if(!accountToken) return res.status(400).json({message: "invalid token"});
        //Delete token so that it is not used again
        await accountToken.destroy();
        //check if token has expired 
        const { createdAt } = accountToken.toJSON();
        const currentTime =  moment(new Date(), moment.ISO_8601);
        const diff = currentTime.diff(moment(createdAt, moment.ISO_8601), "minutes");
        const accountExpireTime = process.env.RESET_TOKEN_EXPIRE_TIME;
        if (diff >= Number(accountExpireTime)) return res.status(400).json({message: "token has expired"});
    
        //activate user
        user.update({active: true});
 
        return res.status(200).json({message: "success"});
     } catch (error) {
         return res.status(500).json({message:" server error", error});
     }
}

const passwordReset =  async (req: Request, res: Response) => {
    const { token, UserId, password } =  req.body;
    if (!token) return res.status(400).json({message:"undefined reset token"});

    try {
       const resetToken = await findToken({ token, UserId });
       if(!resetToken) return res.status(400).json({message: "invalid token"});
       //Delete token so that it is not used again
       await resetToken.destroy();
       //check if token has expired 
       const { createdAt } = resetToken.toJSON();
       const currentTime =  moment(new Date(), moment.ISO_8601);
       const diff = currentTime.diff(moment(createdAt, moment.ISO_8601), "minutes");
       const resetExpireTime = process.env.RESET_TOKEN_EXPIRE_TIME;
       if (diff >= Number(resetExpireTime)) return res.status(400).json({message: "token has expired"});
       //Updating user password logic
       const user = await findUserById(UserId);
       if (!user) return res.status(404).json({message: "user does not exists"}); 
       //hash password
       const hashedPassword = await argon2.hash(password);
       user.update({password: hashedPassword});

       return res.status(200).json({message: "success"});
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}


export {
    acountActivation,
    forgotPassword,
    passwordReset,
    refreshAccessToken,
    resendActivationToken,
    signIn,
} 
