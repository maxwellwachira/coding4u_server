import { Request, Response } from 'express';
import crypto from "crypto";
import { UploadedFile } from 'express-fileupload';
import path from 'path';

import {
    addUpload,
    findAllUploads,
    findAllUploadsInCategory,
    searchUploadByTitle,
    findUploadById,
    findUploadByUserId,
    findUploadByTitle
} from './uploadsService';

const createUpload = async (req: Request, res: Response) => {
    const { CategoryId, UserId } = req.body;
    try {
        // check if file has been uploaded
        if(!req.files) return res.status(400).json({message: "file cannot be empty"});
        let file = req.files.file as UploadedFile;
        //check if upload exists
        const upload = await findUploadByTitle(file.name);
        if (upload) return res.status(400).json({message: "upload already exists"});
        const fileNameArr= file.name.split(".");
        const fileExtension = fileNameArr[fileNameArr.length - 1];
        //upload if file does not exists
        const uploadFileName = `${crypto.randomUUID()}.${fileExtension}`;
        const uploadUrl = `public/uploads/files/${uploadFileName}`;
        file.mv(uploadUrl);
        //Add upload if does not exists
        const record  = await addUpload({fileName: file.name,  fileExtension, CategoryId, fileType:file.mimetype.split("/")[0], fileSize:file.size, filePath: uploadUrl, UserId});
        return res.status(201).json({record, message:"success"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"error", error});
    }
}

const getAllUploads = async (req: Request, res: Response) => {
    let page = req.query?.page as number | undefined;
    let limit = req.query?.limit as number | undefined;
    //if page is undefined set default to 1
    if(!page) page = 1;
    //if limit is undefined set default to 10
    if(!limit) limit = 10;

    try {
        //Find uploads with pagination
        const uploads = await findAllUploads(page, limit);
        return res.status(200).json(uploads);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const getAllUploadsInCategory = async (req: Request, res: Response) => {
    let page = req.query?.page as number | undefined;
    let limit = req.query?.limit as number | undefined;
    let CategoryId = req.params.categoryId as string;
    //if page is undefined set default to 1
    if(!page) page = 1;
    //if limit is undefined set default to 10
    if(!limit) limit = 10;

    try {
        //Find uploads with pagination
        const students = await findAllUploadsInCategory(page, limit, Number(CategoryId));
        return res.status(200).json(students);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const searchUpload = async (req: Request, res: Response) => {
    let page = req.query?.page as number | undefined;
    let limit = req.query?.limit as number | undefined;
    let uploadTitle = req.query.uploadTitle as string;
    //if page is undefined set default to 1
    if(!page) page = 1;
    //if limit is undefined set default to 10
    if(!limit) limit = 10;

    try {
        //Find uploads with pagination
        const upload = await searchUploadByTitle(page, limit, uploadTitle);
        return res.status(200).json(upload);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const getOneUpload = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const upload = await findUploadById(Number(id));
        if (!upload) return res.status(404).json({message: `upload with id = ${id} does not exists`});
        return res.json(upload);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const updateUpload =  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { fileName } = req.body;

    try {
        const upload = await findUploadById(Number(id));
        if (!upload) return res.status(404).json({message: `upload with id = ${id} does not exists`});
        //get upload object
        upload.set({fileName});
        await upload.save();
        return res.status(200).json({message:"success"});
        
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }

}

const removeUpload = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const upload = await findUploadById(Number(id));
        if (!upload) return res.status(404).json({message: `upload with id = ${id} does not exists`});

        const deletedupload = await upload.destroy();
        return res.json({record: deletedupload});
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const downloadFile = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const upload = await findUploadById(Number(id));
        if (!upload) return res.status(404).json({message: `upload with id = ${id} does not exists`});
        const { filePath} = upload.toJSON();
        const fullPath = path.join(__dirname, `../../../../${filePath}`);
        console.log(fullPath);
        res.sendFile(fullPath);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

export {
    createUpload,
    downloadFile,
    getAllUploads,
    getAllUploadsInCategory,
    getOneUpload,
    removeUpload,
    searchUpload,
    updateUpload
};