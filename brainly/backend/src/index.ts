import express from 'express';
import connectDB from './config/db';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoutes';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("api/v1/user",userRouter);

connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    }
    );
}).catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
}
);