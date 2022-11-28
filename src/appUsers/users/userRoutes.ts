import express from 'express';

import {
    createUser,
    getAllStudents,
    getAllTutors,
    getAllUsers,
    getOneUser,
    getUserMe,
    removeUser,
    updateUser
} from './userController';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = express.Router();

//create user
router.post('/', createUser);
//protected routes
//router.use(authMiddleware);
//Get all users
router.get('/', getAllUsers);
//user me
router.get('/me', authMiddleware, getUserMe)
//Get all students
router.get('/students', getAllStudents);
//Get all tutors
router.get('/tutors', getAllTutors);
//get one user
router.get('/:id', getOneUser);
//update user
router.put('/:id', updateUser);
//delete user
router.delete('/:id', removeUser);

export default router;