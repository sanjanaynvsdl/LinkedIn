import express from 'express';
import { signup, login, logout, getCurrUser } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router= express.Router();
router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);

//get a particular user-details
//Implemnted the protectedROute middleware(This validates first, before getting the data)
router.get('/me', protectRoute, getCurrUser); 


export default router;