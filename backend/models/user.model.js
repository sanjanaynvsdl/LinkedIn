import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    username : {
        type:String, 
        required:true,
        unique:true,
    },
    email : {
        type:String,
        required:true,
        unique:true,
    },
    password : {
        type:String,
        required:true,
    },
    profilePicture : {
        type:String,
        default:"",
    },
    bannerImg : {
        type:String,
        default:"",
    },
    headline : {
        //ex - HR, developer
        type:String,
        default:"LinkedIn User"
    }, 
    location : {
        type:String,
        default:"Earth",
    },
    about : {
        type :String, 
        default:"",
    },
    skills : [String],

    experience : [
        {
            title:String,
            company:String,
            startDate:Date,
            endDate:Date,
            description:String,
        },
    ],

    education : [
        {
            school:String,
            fieldOfStudy:String,
            startYear:Number,
            endYear:Number,
        },
    ],

    //Assume as, ["Jhon", "Don"] -> So, we will store this id's for this we use,
    //Each connection will, be a id of user!
    connections : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }]


},{timestamps:true});
//This timestamp, also notes the data created on, updated on etc!

const User = mongoose.model("User", userSchema);
export default User;



 