import sequelize from "sequelize";

import { CertificateModel } from "./certModel"; 

interface CertificateData {
    UserId: number;
    CourseId: number;
    fullName: string;
}

const addCertificate = async ({ UserId, CourseId, fullName }: CertificateData) => {
    return await CertificateModel.create({
        UserId,
        CourseId,
        fullName
    });
}

const findAllCertificates = async (page: number, limit: number) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await CertificateModel.findAndCountAll({
        limit,
        offset,
        order: [['id', 'ASC']]
    });
    const totalPages = Math.ceil(count / limit);

    return {
        totalCertificates: count,
        totalPages,
        currentPage: page,
        certificates: rows
    };
}

const findAllCertificatesInCourse = async (page: number, limit: number , CourseId: number) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await CertificateModel.findAndCountAll({
        where: {
            CourseId
        },
        limit,
        offset,
        order: [['id', 'ASC']]
    });
    const totalPages = Math.ceil(count / limit);

    return {
        totalCertificates: count,
        totalPages,
        currentPage: page,
        certificates: rows
    };
}

const findCertificateById = async (id: any) => {
    return await CertificateModel.findOne({
        where: {
            id, 
        }
    });
}


const findCertificateByUserId = async (page: number, limit: number, UserId: number) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await CertificateModel.findAndCountAll({
        where: {
            UserId
        },
        limit,
        offset,
        order: [['id', 'ASC']]
    });
    const totalPages = Math.ceil(count / limit);

    return {
        totalCertificates: count,
        totalPages,
        currentPage: page,
        certificates: rows
    };
}

const findCertificateCountByUserId = async (UserId: number) => {
    const { count } = await CertificateModel.findAndCountAll({
        where: {
            UserId
        }
    });

    return {
        count,
    };
}

const findCertificateByUserIdAndCourseId = async (UserId: number, CourseId: number) => {
    return await CertificateModel.findOne({
        where: {
            UserId,
            CourseId
        }
    });
}

export {
    addCertificate,
    findAllCertificates,
    findAllCertificatesInCourse,
    findCertificateById,
    findCertificateByUserId,
    findCertificateByUserIdAndCourseId,
    findCertificateCountByUserId
};