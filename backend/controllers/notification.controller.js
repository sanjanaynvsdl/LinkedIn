import mongoose from "mongoose";
import Notification from "../models/notification.model.js"

export const getUserNotifications = async(req,res)=> {
    try {
        const notifications = await Notification.find({ recipient: req.user._id}).sort({createdAt:-1})
        .populate("relatedUser","name username profilePicture")
        .populate("relatedPost", "content image")

        res.status(200).json({
            error:false,
            notifications,
            message:"Fetched All notifications sucessfully!",
        });

        } catch (error) {
            console.log("An error occured in getUserNotification controller : ", error.message);
            return res.json({
                error:true,
                message:"Internal server error!",
            })
        
    }
}

export const markNotificationAsRead= async(req,res)=> {
    const notificationId= req.params.id;
    //check if it is valid
    if(!mongoose.Types.ObjectId.isValid(notificationId)) {
        return res.status(404).json({
            error:true,
            message:"Invalid Notification Id format"
        })
    }


    try {
        const notification= await Notification.findByIdAndUpdate(
            {_id:notificationId, recipient: req.user._id},
            {read:true},
            {new:true},
        )

        

        return res.json({
            error:false,
            notification,
            message:"Marked as true",
        })
         
        
    } catch (error) {
        console.log("An error occured in markNotificationAsRead controller : ", error.message);
        return res.status(500).json({
            error:true,
            message:"Internal server error!"
        });
        
    }

}

export const deleteNotification = async(req,res)=> {
    const notificationId = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(notificationId)) {
        return res.status(404).json({
            error:true,
            message:"Invalid notification id format"
        })
    }

    try {
        const notification = await Notification.findOneAndDelete({
            _id : notificationId,
            recipient:req.user._id,
        })

        return res.status(200).json({
            error:false,
            message:"Deleted Notification successfully!"
        })  

    } catch (error) {
        console.log("An error occured in deleteNotification controller : ", error.message);
        return res.status(500).json({
            error:true,
            message:"Internal server error"
        })
        
    }

}