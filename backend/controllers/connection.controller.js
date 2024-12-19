import mongoose from "mongoose";
import ConnectionRequest from "../models/connectionRequest.model.js";
import Notification from "../models/notification.model.js";
import User from '../models/user.model.js'
import { sendConnectionAcceptedEmail } from "../emails/emailHandlers.js";


// Handle all the edge cases,
//Invlid input id, checki using the mongoose queriessss!
//1. A user cannot send request to himself
//2. Already connected case
//3. Check if the connection-Req already exits!
export const sendConnectionRequest = async(req,res)=> {
    try {
        // const {userId}= req.params; (both are crct to extract userId)
        const userId= req.params.userId;
        const senderId = req.user._id;

        if(!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                error:true,
                message:"Invalid Id passed!"
            })
        }

        //req to him-self
        if(senderId.toString()==userId) {
            return res.status(400).json({
                error:true,
                message:"You can't send a request to yourself",
            })
        }

        //already connected case,
        if(req.user.connections.includes(userId)) {
            return res.status(400).json({
                error:true,
                message:"You are already connected!"
            })
        }

        const existingRequest = await ConnectionRequest.findOne({
            sender:senderId,
            recipient:userId,
            status:"pending",
        });

        //if connection-request already exists!
        if(existingRequest) {
            return res.status(400).json({
                error:true,
                message:"Connection request already exists!"
            })
        }

        const newConnectionReq= await ConnectionRequest({
            sender:senderId,
            recipient:userId
        });

        await newConnectionReq.save();

        return res.status(201).json({
            error:false,
            message:"Connection request sent successfully!"
        });

        
    } catch (error) {
        console.log("An error occured in sendConnectionReq controller : ", error.message);
        return res.status(500).json({
            error:true,
            message:"Internal server error!"
        })
    }
}



//Extract the requesID, populate the fields to send email,
//Handle edge cases
//Update connections of the both the users,
//Create notification and send an email.
//Even though there's error in catch (sending mail) - After logging the error, the execution continues outside the blockk.
export const acceptConnectionRequest= async(req,res)=> {
    try {
        const {requestId}= req.params;
        const userId= req.user._id;

        if(!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({
                error:true,
                message:"Invalid Id passed!"
            })
        }

        const request = await ConnectionRequest.findById(requestId)
        .populate("sender", "name username email")
        .populate("recipient", "name username")

        if(!requestId) {
            return res.status(400).json({
                error:true,
                message:"Connection Request not found!"
            })
        }
        //checking if the req, is for the current-user
        if(request.recipient._id.toString()!== userId.toString()) {
            return res.status(403).json({
                error:true,
                message:"Not authorized to accept this request",
            })
        }

        if(request.status !=="pending") {
            return res.status(400).json({
                error:true,
                message:"This request has been already processed!"
            })
        }

        request.status = "accepted";
        await request.save();
        //I need to update the connection list of both users (as one accepted the request)
        //if I'm your frnd then ur also my frnd!
        await User.findByIdAndUpdate(request.sender._id, 
            { $addToSet : {connections :userId } }
        );
        await User.findByIdAndUpdate(userId, 
            { $addToSet : {connections : request.sender._id} }
        );


        //Send a email to the user, As connection accepted!
        const notification = new Notification({
            recipient:request.sender._id,
            type:"connectionAccepted",
            relatedUser:userId,

        });

        await notification.save();

        //send a connection accepted sendWelcomeEmail,
        const senderEmail= request.sender.email;
        const senderName= request.sender.name;
        
        const recipientName= request.recipient.name;
        const profileUrl=process.env.CLIENT_URL + "/profile/" + request.recipient.name;
        try {
            await sendConnectionAcceptedEmail(senderEmail, senderName, recipientName, profileUrl);
            console.log("email for connection accepted sent successfully!");
        } catch (error) {
            console.log("Error in sending connectionAcceptedEmail : ", error.message);
            
        }
        return res.status(200).json({
            error:false,
            message:"Connection accepted successfully!"
        });
        
    } catch (error) {
        console.log("Error in acceptConnectionRequest controller : ", error.message);
        return res.status(500).json({
            error:true,
            message:"Internal server error",
        })
        
    }
    
}

//Get the requestId, and validate
//Handle edge cases (ex-not authorized, req!=pending)
//Then update status, save!
export const rejectConnectionRequest = async(req,res)=> {
    try {
        const {requestId} = req.params;
        const userId = req.user._id;

        //Handle invalid case-
        if(!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({
                error:true,
                message:"Invalid Id passed!"
            })
        }

        const request = await ConnectionRequest.findById(requestId);
        if(request.recipient.toString() !== userId.toString()) {
            console.log(request.recipient, userId);
            return res.status(403).json({
                error:true,
                message:"Not authorized to reject this request!"
            })
        }

        if(request.status!="pending") {
            return res.status(400).json({
                error:true,
                message:"This request has been processed already!"
            })
        }

        request.status="rejected",
        await request.save();

        return res.json({
            error:false,
            message:"Request rejected successfully!"
        })

    } catch (error) {
        console.log("Error in rejectConnectionRequest controller : ", error.message);
        return res.status(500).json({
            error:true,
            message:"Internal server error!"
        })
        
    }
    
}


//Fetch and populate all the request from the connectionRequest collection,
export const getConnectionRequests = async(req,res)=> {
    try {
        const userId=req.user._id;
        const requests = await ConnectionRequest.find({  recipient:userId, status:"pending"})
        .populate("sender", "name username profilePicture headline connections");

        return res.json({
            error:false,
            requests,
            message:"Fetched all the connectionRequests"
        })
    } catch (error) {
        console.log("Error occured in getConnectionRequests controller : ", error.message);
        return res.status(500).json({
            error:true,
            message:"Internal server error!"
        })
    }
}


//BY using id populate the connections.
export const getUserConnections= async(req,res)=> {
    try {
        const userId = req.user._id;

        const userConnections = await User.findById(userId).populate(
            "connections",
            "name username profilePicture headline connections"
        );

        //handle null/undefinde cases,
        if (!userConnections || !userConnections.connections) {
            return res.status(404).json({
                error: true,
                message: "User or connections not found!",
            });
        }

        return res.status(200).json({
            error:false,
            connections:userConnections.connections,
            message:"Fetched user connections successfully!"
        });

    } catch (error) {
        console.log("Error in getUserConnections controller : ", error.message);
        return res.status(500).json({
            error:true,
            message:"Internal server error!"
        })
    }
}

//Remove connection from both the users,
export const removeConnection= async(req,res)=> {
    try {
        const {userId} = req.params;
        const myId= req.user._id;

        //Handle in-valid id format case
        if(!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                error:true,
                message:"Invalid Id passed!"
            })
        }

        await User.findByIdAndUpdate(myId, {$pull : {connections : userId} } );
        await User.findByIdAndUpdate(userId, {$pull : {connections : myId} } );

        return res.status(200).json({
            error:false,
            message:"Connection removed successfully!"
        });
        
    } catch (error) {
        console.log("Error occurred in removeConnection controller : ", error.message);
        return res.status(500).json({
            error:true,
            message:"Internal server error!"
        });
    }
}


export const getConnectionStatus = async(req,res)=> {
    try {
        const targetUserId = req.params.userId;
        const currUserId = req.user._id;

        //Handle in-valid id format case
        if(!mongoose.Types.ObjectId.isValid(targetUserId)) {
            return res.status(400).json({
                error:true,
                message:"Invalid Id passed!"
            })
        }
        const currentUser= req.user;

        //Already conected case,
        if(currentUser.connections.includes(targetUserId)) {
            return res.json({
                status:"connected"
            })
        }

        const pendingRequest = await ConnectionRequest.findOne({
            $or : [
                { sender : currUserId, recipient : targetUserId },
                { sender : targetUserId, recipient : currUserId }
            ],
            status:"pending",
        });

        if(pendingRequest) {
            if(pendingRequest.sender.toString() === currUserId.toString()) {
                return res.json({status : "pending"});
            } else {
                return res.json({ status:"received",requestId : pendingRequest._id });
            }
        }

        //if no connection or no req found
        res.json({ status:"not_connected"});

    } catch (error) {

        console.log("Error in getConnectionStatus controller : ", error.message);
        return res.json({
            error:true,
            message:"Internal server error!"
        });
    }
    
}
