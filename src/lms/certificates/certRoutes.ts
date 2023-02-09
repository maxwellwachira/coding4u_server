import express from 'express';

import {
    createCertificate,
    getAllCertificates,
    getAllCertificatesByUser,
    getAllCertificatesInCourse,
    getCertificateByUserAndCourse,
    getCertificateCountByUserId,
    getOneCertificate,
    removeCertificate,
    
} from './certController';

import { authMiddleware } from '../../middleware/authMiddleware';

const router = express.Router();

//protected routes
//router.use(authMiddleware);
//create certificate
router.post('/', createCertificate);
//Get all certificates
router.get('/', getAllCertificates);
//get my certificates
router.get('/me', authMiddleware, getAllCertificatesByUser);
//certificates by course
router.get('/course/:courseId', getAllCertificatesInCourse);
//Get single certificate by course and user Id
router.get('/course/:courseId/user/:userId', getCertificateByUserAndCourse);
//get single user certificate count
router.get('/count/:userId', getCertificateCountByUserId);
//get one certificate
router.get('/:id', getOneCertificate);
//delete certificate
router.delete('/:id', removeCertificate);

export default router;