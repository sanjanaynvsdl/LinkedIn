import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema({
    sender: {
        //This are id's which are referring to the User, when-ever we need we just, populate them,
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    recipient: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:String,
        enum:["pending", "accepted", "rejected"],
        default:"pending",
    }
}, {timestamps:true});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

export default ConnectionRequest;