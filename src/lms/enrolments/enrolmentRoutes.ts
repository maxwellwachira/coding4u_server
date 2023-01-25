import express from 'express';

import {
    createEnrolment,
    getAllEnrolments,
    getAllEnrolmentsByUser,
    getAllEnrolmentsInCourse,
    getEnrolmentByUserAndCourse,
    getEnrolmentCountByUserId,
    getOneEnrolment,
    removeEnrolment,
    updateEnrolment
} from './enrolmentController';

import { authMiddleware } from '../../middleware/authMiddleware';

const router = express.Router();

//protected routes
//router.use(authMiddleware);
//create enrolment
router.post('/', createEnrolment);
//Get all enrolments
router.get('/', getAllEnrolments);
//get my enrolments
router.get('/me', authMiddleware, getAllEnrolmentsByUser);
//enrolments by course
router.get('/course/:courseId', getAllEnrolmentsInCourse);
//Get single enrolment by course and user Id
router.get('/course/:courseId/user/:userId', getEnrolmentByUserAndCourse);
//get single user enrolment count
router.get('/count/:userId', getEnrolmentCountByUserId);
//get one enrolment
router.get('/:id', getOneEnrolment);
//update enrolment
router.put('/:id', updateEnrolment);
//delete enrolment
router.delete('/:id', removeEnrolment);

export default router;