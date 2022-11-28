import sequelize from "sequelize";

import { EnrolmentModel } from "./enrolmentModel"; 

interface EnrolmentData {
    UserId: number;
    CourseId: number;
    progress: number;
}

const addEnrolment = async ({ UserId, CourseId, progress }: EnrolmentData) => {
    return await EnrolmentModel.create({
        UserId,
        CourseId,
        progress
    });
}

const findAllEnrolments = async (page: number, limit: number) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await EnrolmentModel.findAndCountAll({
        limit,
        offset,
        order: [['id', 'ASC']]
    });
    const totalPages = Math.ceil(count / limit);

    return {
        totalEnrolments: count,
        totalPages,
        currentPage: page,
        enrolments: rows
    };
}

const findAllEnrolmentsInCourse = async (page: number, limit: number , CourseId: number) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await EnrolmentModel.findAndCountAll({
        where: {
            CourseId
        },
        limit,
        offset,
        order: [['id', 'ASC']]
    });
    const totalPages = Math.ceil(count / limit);

    return {
        totalEnrolments: count,
        totalPages,
        currentPage: page,
        enrolments: rows
    };
}

const findEnrolmentById = async (id: number) => {
    return await EnrolmentModel.findOne({
        where: {
            id, 
        }
    });
}


const findEnrolmentByUserId = async (page: number, limit: number, UserId: number) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await EnrolmentModel.findAndCountAll({
        where: {
            UserId
        },
        limit,
        offset,
        order: [['id', 'ASC']]
    });
    const totalPages = Math.ceil(count / limit);

    return {
        totalEnrolments: count,
        totalPages,
        currentPage: page,
        enrolments: rows
    };
}

const findEnrolmentByUserIdAndCourseId = async (UserId: number, CourseId: number) => {
    return await EnrolmentModel.findOne({
        where: {
            UserId,
            CourseId
        }
    });
}

export {
    addEnrolment,
    findAllEnrolments,
    findAllEnrolmentsInCourse,
    findEnrolmentById,
    findEnrolmentByUserId,
    findEnrolmentByUserIdAndCourseId
};