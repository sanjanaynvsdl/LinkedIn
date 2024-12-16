import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        if (!MONGO_URI) {
        console.error('MONGO_URI is not defined in the .env file');
        process.exit(1);
}
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`Connected to Database - ${conn.connection.host}`);
    } catch (err) {
        console.log(`Error while connecting to DB - ${err.message}`);
        process.exit(1);
    }
};
