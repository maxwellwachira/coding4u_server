import express from 'express';

const router = express.Router();

//create admin
router.post('/');
//Get all admin
router.get('/');
//get one admin
router.get('/:id');
//update admin
router.put('/:id');
//delete admin
router.delete('/:id');

export default router;