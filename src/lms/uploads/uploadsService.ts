import sequelize from "sequelize";

import { UploadModel } from "./uploadsModel"; 

interface UploadData {
    fileName: string;
    fileExtension: string;
    CategoryId: number;
    fileType: string;
    fileSize: number;
    filePath: string;
    UserId: number;
}

const addUpload = async ({ fileName, fileExtension,  CategoryId, fileType, fileSize, filePath, UserId }: UploadData) => {
    return await UploadModel.create({
        fileName,
        fileExtension,
        CategoryId,
        fileType,
        fileSize,
        filePath,
        UserId,
    });
}

const findAllUploads = async (page: number, limit: number) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await UploadModel.findAndCountAll({
        limit,
        offset,
        order: [['id', 'ASC']]
    });
    const totalPages = Math.ceil(count / limit);

    return {
        totalUploads: count,
        totalPages,
        currentPage: page,
        uploads: rows
    };
}

const findAllUploadsInCategory = async (page: number, limit: number , CategoryId: number) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await UploadModel.findAndCountAll({
        where: {
            CategoryId
        },
        limit,
        offset,
        order: [['id', 'ASC']]
    });
    const totalPages = Math.ceil(count / limit);

    return {
        totalUploads: count,
        totalPages,
        currentPage: page,
        uploads: rows
    };
}

const searchUploadByTitle = async (page: number, limit: number, fileName: string) => {
    const Op = sequelize.Op;
    const offset = (page - 1) * limit;

    const { count, rows } = await UploadModel.findAndCountAll({
        where: {
            fileName: {
                [Op.like]: `%${fileName}%`
            }
        },
        limit,
        offset
    });
    const totalPages = Math.ceil(count);

    return {
        totalUploads: count,
        totalPages,
        currentPage: page,
        uploads: rows
    };
}

const findUploadById = async (id: number) => {
    return await UploadModel.findOne({
        where: {
            id, 
        }
    });
}

const findUploadByTitle = async (fileName: string) => {
    return await UploadModel.findOne({
        where: {
            fileName
        }
    });
}

const findUploadByUserId = async (UserId: number) => {
    return await UploadModel.findOne({
        where: {
            UserId
        }
    });
}

export {
    addUpload,
    findAllUploads,
    findAllUploadsInCategory,
    searchUploadByTitle,
    findUploadById,
    findUploadByUserId,
    findUploadByTitle
};