import express from 'express';
import { getFeedPosts, createPost, deletePost ,getPostById, createComment, likePost} from '../controllers/post.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js';

const router=express.Router();

//Try getFeedPost route after setting the connections
router.get("/", protectRoute, getFeedPosts);
router.post("/create", protectRoute, createPost);       //working
router.delete("/delete/:id", protectRoute, deletePost); //working
router.get("/:id", protectRoute, getPostById);             
router.post("/:id/comment", protectRoute, createComment); 
router.post("/:id/like", protectRoute, likePost);         



export default router;