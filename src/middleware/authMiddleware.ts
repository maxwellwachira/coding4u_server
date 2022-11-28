import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as Secret;


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        console.log(token)
        if (!token) return res.status(401).json({message: "unauthorized"});

        const decodeData = jwt.verify(token, SECRET_KEY) as JwtPayload;

        res.locals.userId = decodeData?.id;

        return next();

    } catch (error: any) {
        if (error.name === 'TokenExpiredError') return res.status(401).json({message: "expiredToken"});
        console.log("error",error);
        return res.status(401).json({message: "invalid Token"});
    }
    
}