import { UserModel } from "../users/userModel";
import { UserRegistrationData } from "./userInterfaces";

const addUser = async ({ firstName, lastName, email, phoneNumber, password, referralCode }: UserRegistrationData) => {
    const role = "student";
    const active = false;
    const disabled = false;

    return await UserModel.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        referralCode,
        role,
        active,
        disabled
    });
}

const findAllUsers = async (page: number, limit: number) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await UserModel.findAndCountAll({
        limit,
        offset,
        order: [['id', 'ASC']]
    });
    const totalPages = Math.ceil(count);

    return {
        totalUsers: count,
        totalPages,
        currentPage: page,
        users: rows
    };
}

const findAllStudents = async (page: number, limit: number) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await UserModel.findAndCountAll({
        where: {
            role: "student"
        },
        limit,
        offset,
        order: [['id', 'ASC']]
    });
    const totalPages = Math.ceil(count / limit);

    return {
        totalStudents: count,
        totalPages,
        currentPage: page,
        students: rows
    };
}

const findAllTutors = async (page: number, limit: number) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await UserModel.findAndCountAll({
        where: {
            role: "tutor"
        },
        limit,
        offset,
        order: [['id', 'ASC']]
    });
    const totalPages = Math.ceil(count);

    return {
        totalTutors: count,
        totalPages,
        currentPage: page,
        tutors: rows
    };
}
const findUserById = async (id: number) => {
    return await UserModel.findOne({
        where: {
            id,
            disabled: false,

        }
    });
}

const findUserByReferralCode = async (referralCode: string) => {
    return await UserModel.findOne({
        where: {
            referralCode
        }
    });
}

const findUserByEmail = async (email: string) => {
    return await UserModel.findOne({
        where: {
            email,
            disabled: false,
        }
    });
}

const editUser = async () => {

}


export {
    addUser,
    editUser,
    findAllStudents,
    findAllTutors,
    findAllUsers,
    findUserByEmail,
    findUserById,
    findUserByReferralCode
};