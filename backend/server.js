import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import { connectDB } from './lib/db.js';


dotenv.config();
const app=express();
app.use(express.json()); //middleware -> Parse JSON request bodies.

app.use("/api/v1/auth",authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
    connectDB();
    console.log(`Server running on this ${PORT}`);
});