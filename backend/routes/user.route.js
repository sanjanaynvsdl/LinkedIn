import express from 'express';
import { getSuggestedConnections,getPublicProfile , updateProfile} from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router= express.Router();

router.get('/suggestion', protectRoute, getSuggestedConnections);
router.get('/:username', protectRoute, getPublicProfile);

router.put('/profile', protectRoute, updateProfile);


export default router;

