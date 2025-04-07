import express from 'express';
import connectDB from './config/database.js';
import cookieParser from 'cookie-parser';
import rateLimit  from "express-rate-limit"
import dotenv from 'dotenv';
dotenv.config();

import employeeRouter from './routes/employeeRouter.js';
import errorHandler from './middlewares/errorHandler.js';


const app = express();
app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 100
});

app.use(limiter);

app.use('/api/v1/leaveRequest', employeeRouter);

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


