import cloudinary from "../lib/cloudinary.js";
import User from "../models/User.model.js"


//In this userContoller, check the way I'm returing dataaa! (In video it's different)
//Also, logg the errors in catch block - can easily debug the errorsss
//suggest connections $ne -> not equl, $in -> in , $nin -> not in.
export const getSuggestedConnections= async(req,res)=> {

    try {
        const currUser = await User.findById(req.user._id).select('connections');

        //find users who are not connected/do not recommended our own profile,
        //just remove the curr user and already connections!
        const suggestedUser  = await User.find({
            _id: {
                $ne : req.user._id, $nin:currUser.connections 
            }
        })
        .select("name username profilePicture headline")
        .limit(3);

        // res.json(suggestedUser);
        return res.json({
            error:false,
            user:suggestedUser,
            message:"Retrived connections successfully!"
        });
        
    } catch (error) {
        console.log("Error in getSuggestedConnections controller :", error.message);
        return res
        .status(500)
        .json({
            error:true,
            message:"Internal server error!"
        });
        
    }
}

//getPublic profile
//1. Token validation, then comes to this function!
//2. Finds the user according to the params passed with req
export const getPublicProfile = async(req, res)=> {
    try {
        const user = await User.findOne({username:req.params.username} ).select("-password");
        if(!user) {
            return res
            .status(400)
            .json({
                error:true,
                message:"User not found!"
            })
        }

        //We can use both!
        //res.json(user);
        return res.json({
            error:false,
            user:user,
            message:"User exists"
        });
    } catch (error) {
        console.log("An error in the getPublicProfile controller :", error.message);
        res.status(500).json({
            error:true,
            message:"Internal Server error!"
        });
        
    }
    
}

//put-request
//By setting the field of user, new:true, this will update and return the obj(hover on new, to understand more)
export const updateProfile = async(req,res)=> {
    try{
        // const response=req.user;
        const allowedFields= [
            "name",
            "username",
            "headline",
            "about",
            "location",
            "profilePicture",
            "bannerImg",
            "skills",
            "experience",
            "education",
        ];

        const updatedData= {};
        for(const field of allowedFields) {
            if(req.body[field]) {
                updatedData[field]=req.body[field];
            }
        }

        //1. If user passes the image, first we will upload it to cloudinary and save to user
        //updating the img using cloudinary and then save it to the updatedData, 
        if(req.body.profilePicture) {
            const result= await cloudinary.uploader.upload(req.body.profilePicture);
            updatedData.profilePicture= result.secure_url;
        }

        if(req.body.bannerImg) {
            const result= await cloudinary.uploader.upload(req.body.bannerImg);
            updatedData.bannerImg= result.secure_url;
        }

        const user= await User.findByIdAndUpdate(req.user._id, {$set:updatedData}, {new:true}).select("-password");

        // res.json(user);
        return res.json({
            error:false,
            user,
            message:"User updated successfully!"
        });


    } catch(error) {
        console.log("An error occured in updateProfile controller :", error.message);
        return res
        .status(500)
        .json({
            error:true,
            message:"Internal Server Error!"
        });

    }
}