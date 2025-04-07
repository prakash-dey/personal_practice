import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";
import dotenv from 'dotenv';
import authRouter from "./routes/authRoutes.js";
dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/v1/auth',authRouter)


connectDB().then(()=>{
    let PORT = process.env.PORT ?? 3000;
    app.listen(PORT,()=>{console.log("Server is running on :",PORT)});

}).catch((err)=>{
    console.log("Failed to connect due to :".err);
});
app.listen()