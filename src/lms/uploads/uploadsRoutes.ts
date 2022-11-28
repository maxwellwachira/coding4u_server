import express from 'express';

import {
    createUpload,
    downloadFile,
    getAllUploads,
    getAllUploadsInCategory,
    getOneUpload,
    removeUpload,
    searchUpload,
    updateUpload
} from './uploadsController';

import { authMiddleware } from '../../middleware/authMiddleware';

const router = express.Router();

//protected routes
//router.use(authMiddleware);
//create upload
router.post('/', createUpload);
//Get all uploads
router.get('/', getAllUploads);
//download file
router.get('/download/:id', downloadFile);
//uploads by category
router.get('/category/:categoryId', getAllUploadsInCategory)
//Get all uploads
router.get('/search', searchUpload);
//get one upload
router.get('/:id', getOneUpload);
//update upload
router.put('/:id', updateUpload);
//delete upload
router.delete('/:id', removeUpload);

export default router;