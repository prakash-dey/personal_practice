import { Router } from "express";
import validate from "../utils/validateInput.js";
import Joi from "joi";

const authRouter = Router();
const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password : Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().required().min(6)
})
authRouter.post("/register", validate(registerSchema))

export default authRouter;