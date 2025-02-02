import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


import connectDB from "./config/db.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();


connectDB().then(()=>{
    let PORT = process.env.PORT ?? 3000;
    app.listen(PORT,()=>{console.log("Server is running on :",PORT)});

}).catch((err)=>{
    console.log("Failed to connect due to :".err);
});
app.listen()