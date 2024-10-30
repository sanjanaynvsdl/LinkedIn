import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';


dotenv.config();
const app=express();
app.use(express.json()); //middleware -> Parse JSON request bodies.
app.use(cookieParser()); //parse cookie -> we can extract the token 

app.use("/api/v1/auth",authRoutes);
// app.use("/api/v1/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
    connectDB();
    console.log(`Server running on this ${PORT}`);
});