import dotenv from "dotenv"
import { PasswordResetModel } from "./models/PasswordResetModel";;
import { AccountActivationModel } from "./models/AccountActivationModel";

dotenv.config();

interface TokenData {
    token: string;
    UserId: number;
}

const addToken = async ({ token, UserId }: TokenData) => {

    return await PasswordResetModel.create({
        token,
        UserId
    });
}

const findToken =  async ({ token, UserId }: TokenData) => {
    return await PasswordResetModel.findOne({
        where: {
            token,
            UserId
        }
    })
}

const addAccountToken = async ({ token, UserId }: TokenData) => {

    return await AccountActivationModel.create({
        token,
        UserId
    });
}

const findAccountToken =  async ({ token, UserId }: TokenData) => {
    return await AccountActivationModel.findOne({
        where: {
            token,
            UserId
        }
    })
}


export {
    addToken,
    addAccountToken,
    findToken,
    findAccountToken
};