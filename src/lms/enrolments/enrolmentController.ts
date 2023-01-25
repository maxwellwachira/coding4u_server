import { Request, Response } from 'express';

import {
    addEnrolment,
    findAllEnrolments,
    findAllEnrolmentsInCourse,
    findEnrolmentById,
    findEnrolmentByUserId,
    findEnrolmentByUserIdAndCourseId,
    findEnrolmentCountByUserId
} from './enrolmentService';

const createEnrolment = async (req: Request, res: Response) => {
    const { CourseId, UserId } = req.body;
    try {
        //check if enrolment exists
        const enrolment = await findEnrolmentByUserIdAndCourseId(Number(UserId), Number(CourseId));
        if (enrolment) return res.status(400).json({message: "enrolment already exists"});
        //Add enrolment if does not exists
        const record  = await addEnrolment({CourseId, UserId, progress: 0});
        return res.status(201).json({record, message:"success"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"error", error});
    }
}

const getAllEnrolments = async (req: Request, res: Response) => {
    let page = req.query?.page as number | undefined;
    let limit = req.query?.limit as number | undefined;
    //if page is undefined set default to 1
    if(!page) page = 1;
    //if limit is undefined set default to 10
    if(!limit) limit = 10;

    try {
        //Find enrolments with pagination
        const enrolments = await findAllEnrolments(page, limit);
        return res.status(200).json(enrolments);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const getAllEnrolmentsByUser = async (req: Request, res: Response) => {
    let page = req.query?.page as number | undefined;
    let limit = req.query?.limit as number | undefined;
    const id = res.locals.userId;
    //if page is undefined set default to 1
    if(!page) page = 1;
    //if limit is undefined set default to 10
    if(!limit) limit = 10;

    try {
        //Find enrolments with pagination
        const enrolments = await findEnrolmentByUserId(page, limit, id);
        return res.status(200).json(enrolments);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const getAllEnrolmentsInCourse = async (req: Request, res: Response) => {
    let page = req.query?.page as number | undefined;
    let limit = req.query?.limit as number | undefined;
    let CourseId = req.params.courseId as string;
    //if page is undefined set default to 1
    if(!page) page = 1;
    //if limit is undefined set default to 10
    if(!limit) limit = 10;

    try {
        //Find enrolments with pagination
        const enrolments = await findAllEnrolmentsInCourse(page, limit, Number(CourseId));
        return res.status(200).json(enrolments);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const getEnrolmentByUserAndCourse = async(req: Request, res: Response) => {
    let CourseId = req.params.courseId as string;
    let UserId = req.params.userId as string;

    try {
        //check if enrolment exists
        const enrolment = await findEnrolmentByUserIdAndCourseId(Number(UserId), Number(CourseId));
        if (enrolment) return res.status(200).json({exists: true});
        return res.status(404).json({exists: false});
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const getEnrolmentCountByUserId = async(req: Request, res: Response) => {
    let UserId = req.params.userId as string;

    try {
        //check if enrolment exists
        const enrolment = await findEnrolmentCountByUserId(Number(UserId));
        return res.status(200).json(enrolment);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const getOneEnrolment = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const enrolment = await findEnrolmentById(Number(id));
        if (!enrolment) return res.status(404).json({message: `enrolment with id = ${id} does not exists`});
        return res.json(enrolment);
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

const updateEnrolment =  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { progress } = req.body;

    try {
        const enrolment = await findEnrolmentById(Number(id));
        if (!enrolment) return res.status(404).json({message: `enrolment with id = ${id} does not exists`});
        //get enrolment object
        enrolment.set({progress});
        await enrolment.save();
        return res.status(200).json({message:"success"});
        
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }

}

const removeEnrolment = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const enrolment = await findEnrolmentById(Number(id));
        if (!enrolment) return res.status(404).json({message: `enrolment with id = ${id} does not exists`});

        const deletedenrolment = await enrolment.destroy();
        return res.json({record: deletedenrolment});
    } catch (error) {
        return res.status(500).json({message:"error", error});
    }
}

export {
    createEnrolment,
    getAllEnrolments,
    getAllEnrolmentsByUser,
    getAllEnrolmentsInCourse,
    getEnrolmentByUserAndCourse,
    getEnrolmentCountByUserId,
    getOneEnrolment,
    removeEnrolment,
    updateEnrolment
};