import express from 'express';
import { signup } from '../controllers/userController';

const userRouter = express.Router();

userRouter.post("/signup",signup);

export default userRouter;