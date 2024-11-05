import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import notificationRoutes from './routes/notification.route.js';
import connectionRoutes from './routes/connection.route.js'

import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';




dotenv.config();
const app=express();
//Added limit for the images (else- throws an error- payload too large)
app.use(express.json({ limit : "5mb "})); //middleware -> Parse JSON request bodies to js object,
app.use(cookieParser()); //parse cookie -> we can extract the token 


app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections",connectionRoutes);




app.get('/', (req, res)=> {
    return res.json({
        message:"Hello"
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
    connectDB();
    console.log(`Server running on this ${PORT}`);
});

