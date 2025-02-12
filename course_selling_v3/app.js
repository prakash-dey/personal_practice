import express from 'express';
import connectDB from './config/database.js';
const app = express();
import cookieParser from 'cookie-parser';
import rateLimit  from "express-rate-limit"
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/authRouter.js';
import errorHandler from './middlewares/errorHandler.js';
import courseRouter from './routes/courseRoutes.js';

app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 100
});

app.use(limiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/course', courseRouter);


app.use(errorHandler);

connectDB().then(() => {
    console.log('Database connected');
  app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port',process.env.PORT);
  });
}).catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});


