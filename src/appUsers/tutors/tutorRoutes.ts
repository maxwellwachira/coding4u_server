import express from 'express';

const router = express.Router();

//get tutor profile
router.get('/:id');
//update tutor
router.put('/:id');
//delete tutor
router.delete('/:id');

export default router;