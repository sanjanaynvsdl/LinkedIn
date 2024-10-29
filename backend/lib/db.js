import mongoose from "mongoose";

export const connectDB= async()=> {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Coneted to Data Base - ${conn.connection.host}`);
    } catch(err) {
        console.log(`Error while connecting to DB - ${err.message}`);
        process.exit(1); 
    }

}