import User from "../models/User.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../emails/emailHandlers.js'

//Also, logg the errors in catch block - can easily debug the errorsss
//1. return res.json
//2. or just set the set.json()
//res.json()-> In this way the code instead of returning, It will execute the next lines!

//<-------------------userController-------------------------------->
//1. Handle Errors
//2. Create user (hash password)
//3. Save user to DB
//4. Generate token, Set the cookie
//5. Send an welcome email
export const signup = async(req,res)=> {
    try{

        const {name, username, email, password} = req.body;
        const existingEmail= await User.findOne({ email });
        const existingUser = await User.findOne({username});

        //handle Errors!
        if(!name || !username || !email || !password) {
            return res
            .status(400)
            .json({
                error:true,
                message:"All fields are required!"
            })
        }
        if(existingEmail) {
            return res
            .status(400)
            .json({
                error:true,
                message:"Email already exists!"
            });
        }
        if(existingUser) {
            return res
            .status(400)
            .json({
                error:true,
                message:"User with this user-name already exists!"
            });
        }
        if(password.length<6) {
            return res
            .status(400)
            .json({
                error:true,
                message:"Password must be atleast 6 characters!"
            })
        }

        //import bcrypt and hash the password
        //Generates salt with the length of 10
        const salt=await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password, salt);

        const user=new User({
            name,
            username,
            email,
            password:hashedPassword,
        })

        //save the user to the DB
        await user.save();

        //Generate the token
        const token=jwt.sign({ userId:user._id }, process.env.JWT_SECRET, {expiresIn:'6d'});
        res.cookie('jwt-linkedin', token ,{
            httpOnly:true, //prevents from the XSS attack
            maxAge:3*24*60*60*1000, //
            sameSite:"strict", //prevents from CSRF attacks
            secure:process.env.NODE_ENV==="production", //prevents man-in-the-middle-attack
        });


        const profileUrl=process.env.CLIENT_URL + '/profile'  + user.username;  

        res
        .status(201)
        .json({
            error:false,
            user,
            message:"User registered successfully !"
        });

        //Sendwelcom-email
        try{
            await sendWelcomeEmail(user.email, user.name, profileUrl) 

        }  catch(emailError) {
            console.log("Error in sending email : ", emailError);
        }

        
        

    } catch(error) {
        console.log("An error occured in sign-up controller : ", error.message);
        return res
        .status(500)
        .json({
            error:true,
            message:"Internal server error!"
        });


    }
}

//1. As user clicks on the logout button
//2. Clear the cookies
export const logout= async(req,res)=> {
    res.clearCookie('jwt-linkedin');
    res.json({
        error:false,
        message:"Logged out successfully!",
    });
    
}

//1. As, user hits this url
//2. Checks the credentials (handles errors)
//3. Generate token and set the cookie
export const login = async (req,res)=> {
    try{
        const {username, password} =req.body;

        //handle errors
        if(!username || !password) {
            return res
            .status(400)
            .json({
                error:true,
                message:"All fields required"
            });
        }

        const user= await User.findOne({username});
        //check if the user-exists in the DB
        if(!user) {
            return res
            .status(400)
            .json({
                error:true,
                message:"User does not exist",
            })
        }

        //decode the password and check,
        const isMatch=await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res
            .status(400)
            .json({
                error:true,
                message:"Invalid password!"
            })
        }

        //If-correct generate the token
        const token = jwt.sign({ userId:user._id}, process.env.JWT_SECRET, {expiresIn: '6d'});
        await res.cookie('jwt-linkedin', token , {
            httpOnly:true, 
            maxAge:3*24*60*60*1000,
            sameSite:"strict",
            secure:process.env.NODE_ENV === 'production',
        });

        // console.log("user logged in",user);
        return res.json({
            error:false,
            user,
            message:"Logged in successfully!"
        });
        

    } catch(error) {
        console.log("Error in login controller : " ,error);
        return res
        .status(500)
        .json({
            error:true,
            message:"Internal server error!"
        })
    }


}

//getUser after the 
//just return the user's data
//protectRoute will check weather this is valid or not, So, not required to verify again!
export const getCurrUser= async(req,res)=> {
    try{
        //res.json(req.user) -> Can directly use this,
        return res.json({
            error:false,
            user:req.user,
            message:"Retieved data successfully!"
        })

    } catch(error) {
        console.log('Error in getCurruser route', error.message);
        return res.status(500).json({
            error:true,
            message:"Internal server error!"
        })

    }

}