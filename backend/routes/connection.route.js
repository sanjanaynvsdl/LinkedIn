import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { sendConnectionRequest, acceptConnectionRequest, rejectConnectionRequest, getConnectionRequests, getUserConnections, removeConnection, getConnectionStatus } from '../controllers/connection.controller.js';

const router= express.Router();

router.post("/request/:userId",protectRoute, sendConnectionRequest);         
router.put("/accept/:requestId", protectRoute, acceptConnectionRequest);     
router.put("/reject/:requestId", protectRoute, rejectConnectionRequest);     

//Get all the connection request of an user,
router.get("/requests", protectRoute, getConnectionRequests);                

//Get all connections of an user,
router.get("/", protectRoute, getUserConnections);                          
router.delete("/:userId", protectRoute, removeConnection);                  
router.get("/status/:userId", protectRoute, getConnectionStatus);           

export default router;