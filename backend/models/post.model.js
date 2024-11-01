import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    
    author :{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    content: {
        type:String,
    },
    image : {
        type:String,
    },
    likes : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],
    Comments : [
        {
            content: { type : String },
            user : { type : mongoose.Schema.Types.ObjectId, ref:"user" },
            createdAt : {type: Date, default : Date.now },
        },
    ],
}, { timestamps : true } );

const Post = mongoose.model("Post", postSchema);

export default Post