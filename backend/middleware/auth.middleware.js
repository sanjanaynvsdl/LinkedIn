import jwt, { decode } from 'jsonwebtoken';
import User from "../models/User.model.js";

export const protectRoute = async(req,res, next)=> {
    try{
        const token = req.cookies['jwt-linkedin'];

        if(!token) {
            return res
            .status(401)
            .json({
                error:true,
                message:"Unauthorized",
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decode) {
            return res
            .status(401)
            .json({
                error:true,
                message:"Invalid user!"
            })
        }
        const user= await User.findById((decoded.userId)).select("-password"); //so, we won't send password to client!
        if(!user) {
            return res
            .status(404)
            .json({
                error:true,
                message:"User not found!",
            })
        }
        console.log(user);
        req.user=user;
        next();
    } catch(error) {
        console.log("Error in authProtector", error.message);
        return res
        .status(500)
        .json({
            message:"Internal server error!"
        });

    }

}