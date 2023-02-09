import { Request, Response } from 'express';

import {
    addCertificate,
    findAllCertificates,
    findAllCertificatesInCourse,
    findCertificateById,
    findCertificateByUserId,
    findCertificateByUserIdAndCourseId,
    findCertificateCountByUserId
} from './certService';

const createCertificate = async (req: Request, res: Response) => {
    const { CourseId, UserId, fullName } = req.body;
    try {
        const record  = await addCertificate({CourseId, UserId, fullName});
        return res.status(201).json({record, message:"success"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"error", error});
    }
}

const getAllCertificates = async (req: Request, res: Response) => {
    let page = req.query?.page as number | undefined;
    let limit = req.query?.limit as number | undefined;
    //if page is undefined set default to 1
    if(!page) page = 1;
    //if limit is undefined set default to 10
    if(!limit) limit = 10;

    try {
        //Find certificates with pagination
        const certificates = await findAllCertificates(page, limit);
        return res.status(200).json(certificates);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const getAllCertificatesByUser = async (req: Request, res: Response) => {
    let page = req.query?.page as number | undefined;
    let limit = req.query?.limit as number | undefined;
    const id = res.locals.userId;
    //if page is undefined set default to 1
    if(!page) page = 1;
    //if limit is undefined set default to 10
    if(!limit) limit = 10;

    try {
        //Find certificates with pagination
        const certificates = await findCertificateByUserId(page, limit, id);
        return res.status(200).json(certificates);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const getAllCertificatesInCourse = async (req: Request, res: Response) => {
    let page = req.query?.page as number | undefined;
    let limit = req.query?.limit as number | undefined;
    let CourseId = req.params.courseId as string;
    //if page is undefined set default to 1
    if(!page) page = 1;
    //if limit is undefined set default to 10
    if(!limit) limit = 10;

    try {
        //Find certificates with pagination
        const certificates = await findAllCertificatesInCourse(page, limit, Number(CourseId));
        return res.status(200).json(certificates);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const getCertificateByUserAndCourse = async(req: Request, res: Response) => {
    let CourseId = req.params.courseId as string;
    let UserId = req.params.userId as string;

    try {
        //check if certificate exists
        const certificate = await findCertificateByUserIdAndCourseId(Number(UserId), Number(CourseId));
        if (certificate) return res.status(200).json({exists: true});
        return res.status(404).json({exists: false});
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const getCertificateCountByUserId = async(req: Request, res: Response) => {
    let UserId = req.params.userId as string;

    try {
        //check if certificate exists
        const certificate = await findCertificateCountByUserId(Number(UserId));
        return res.status(200).json(certificate);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const getOneCertificate = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const certificate = await findCertificateById(id);
        if (!certificate) return res.status(404).json({message: `certificate with id = ${id} does not exists`});
        return res.json(certificate);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"error", error});
    }
}

const removeCertificate = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const certificate = await findCertificateById(Number(id));
        if (!certificate) return res.status(404).json({message: `certificate with id = ${id} does not exists`});

        const deletedcertificate = await certificate.destroy();
        return res.json({record: deletedcertificate});
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

export {
    createCertificate,
    getAllCertificates,
    getAllCertificatesByUser,
    getAllCertificatesInCourse,
    getCertificateByUserAndCourse,
    getCertificateCountByUserId,
    getOneCertificate,
    removeCertificate,
};