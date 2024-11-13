import cloudinary from '../lib/cloudinary.js';
import Post from '../models/post.model.js'
import Notification from '../models/notification.model.js'
import { sendCommentNotificationEmail } from '../emails/emailHandlers.js';
import mongoose from 'mongoose';



//1. By using populate method we can get the user-post (As,we need username, profikePicture, headline)
//2. Same by using the popoluate method, get the user-details for the comments sections
//3. Sort according to the latest,
export const getFeedPosts = async(req,res)=> {
    try {
        const posts = await Post.find({author: {
            $in:[...req.user.connections, req.user._id]
        }})
        .populate("author", "name username profilePicture headline")
        .populate("comments.user", "name profilePicture")
        .sort({ createdAt : -1});

        // console.log(posts);

        res.status(200).json(posts);

    } catch (error) {
        console.log("An error occured in getFeedPosts controller : ", error.message);
        return res.json({
            error:true,
            message:"Internal server error!",
        })
    } 
}

//1. Take the content and image
//2. Check for the image else, save and return the post,
export const createPost = async(req,res)=> {
    try {
        const {content, image} = req.body;
        let newPost;

        // console.log("content", content);
        // console.log("IMage", image); //data:String will be logged,
        if(image) {
            const imgResult = await cloudinary.uploader.upload(image);
            newPost = new Post({
                author:req.user._id,
                content,
                image:imgResult.secure_url,
            })
        } else {
            //if user does not pass image
            newPost = new Post ({
                author:req.user._id,
                content,
            })
        }
        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        console.log("An error occured in create Post : ", error.message);
        return res.json({
            error:true,
            message:"Internal server error!"
        })
    }
}

//1. Get the post, and userInfo
//2. check weather the author is the owner of the post
//3. Then delete!
export const deletePost = async(req, res)=> {

    try {
        const postId= req.params.id;

        // Check if postId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                error: true,
                message: "Invalid Post ID format!",
            });
        }
        const userId= req.user._id;
        const post = await Post.findById(postId);

        if(!post) {
            return res.status(400).json({
                error:true,
                message:"Post not found!"
            })
        }

        //Checking if the current user is the author of the post,
        if(post.author.toString() !== userId.toString()) {
            return res.status(403).json({
                error:true,
                message:"You are not authorized to delete this post!"
            })
        }

        if(post.image) {
            //The image url is smthng like this 
            //http://cloudinary.com/dwfwefrfer/image/upload/vhjcsdjc/wdfw.png
            //we only need the last part after '/' we will sperate it using below functions
            await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0]);
            console.log("Image from cloudinary deleted successfully!")
        }

        await Post.findByIdAndDelete(postId);
        res.status(200).json({message: "post deleted successfully!"});


    } catch (error) {
        console.log("An error occured in deletePost controller : ", error.message);
        return res.json({
            error:true,
            message:"Internal server error!",
        });
        
    }
}


//get the post by id,
//accr to post model fetch the details of user by using populate method
export const getPostById = async(req,res)=> {
    try{

        const postId=req.params.id;

        // Check if postId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                error: true,
                message: "Invalid Post ID format!",
            });
        }

        const post= await Post.findById(postId)
        .populate("author", "name username profilePicture headline")
        .populate("comments.user", "name profilePicture username headline");

        if(!post) {
            return res
            .status(404)
            .json({
                error:true,
                message:"Post not found!"
            })
        }

        res.status(200).json(post);

    } catch(error) {
        console.log("An error in getPostById controller : ", error.message);
        return res
        .status(500)
        .json({
            error:true,
            message:"Internal server error!",
        })
    }
}

//1. find the post by Id, and push into the comments array!
//2. populate some stuff as we need to send an eamil,
//3. create a notification if the comment owner is not the post owner
export const createComment= async(req,res)=> {

    try {
        const postId=req.params.id;
        // Check if postId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                error: true,
                message: "Invalid Post ID format!",
            });
        }

        const {content}= req.body;

        const post = await Post.findByIdAndUpdate(postId, {
            $push: {comments : {user: req.user._id, content} },
        }, {new : true}).populate("author", "name email username headline profilePicture");

        if(post.author._id.toString()!== req.user._id.toString()) {
            const newNotification  =  new Notification({
                recipient:post.author,
                type:"comment",
                relatedUser:req.user._id,
                relatedPost:postId,
            })
            await newNotification.save();

            //Send an email,
            try {
                const postUrl= process.env.CLIENT_URL + "/post/" + postId;
                await sendCommentNotificationEmail(post.author.email, post.author.name, req.user.name, postUrl, content);
            } catch (error) {
                console.log("Error in sending notification email : ",error.message);
                
            }
        }
        res.status(200).json(post);
        
    } catch (error) {
        console.log("An error occured in createComment controller : ", error.message);
        return res
        .status(500)
        .json({
            error:true, 
            message:"Internal server error!"
        });
        
    }
}


//1. Two cases like/dislike the post,
//2. Create a notification if the post-owner is not the person who liked the post,
export const likePost = async(req,res)=> {
    try {
        const postId= req.params.id;

        // Check if postId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                error: true,
                message: "Invalid Post ID format!",
            });
        }
        
        const post = await Post.findById(postId);
        const userId= req.user._id;

        //unlike the post,
        if(post.likes.includes(userId)) {
            post.likes = post.likes.filter((id)=> id.toString()!=userId.toString());

        } else {
            //like the post
            post.likes.push(userId);
        }

        //Notification comment
        if(post.author.toString()!==userId.toString) {
            const newNotification = new Notification({
                recipient:post.author,
                type:"like",
                relatedUser:userId,
                relatedPost:postId,
            });

            await newNotification.save();
        }
        await post.save();

        return res.json({message:"Liked/Unliked post!"});
        
    } catch (error) {
        console.log("An error occurred in likePost controller : ", error.message);
        return res.status(500).json({
            error:true,
            message:"Internal server error!"
        })
    }
    
};