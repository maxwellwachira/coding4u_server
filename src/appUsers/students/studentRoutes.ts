import express from 'express';

const router = express.Router();

//get one student
router.get('/:id');
//update student
router.put('/:id');
//delete student
router.delete('/:id');

export default router;