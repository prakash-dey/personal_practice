import { NextFunction,Request,Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ErrorResponse from "../utils/errorResponse";
import { signupValidation } from "../utils/validator";
import UserModel from "../model/UserModel";

export const  signup = asyncHandler(async(req: Request, res: Response , next :NextFunction) => {
    // get user data from request body
    const { name, email, password } = req.body;
    // do validation using zod
    const validation = signupValidation({ name, email, password });
    if (!validation.success) { 
        return next(new ErrorResponse(validation.error.errors[0].message as string, 400));
    }

    // check if user already exists
    const isUserExistsAlready = await UserModel.findOne({ email });
    if (isUserExistsAlready) {
        return next(new ErrorResponse("User already exists", 400));
    }
    const user = await UserModel.create({name,email,password});
    if (!user) {
        return next(new ErrorResponse("User not created", 400));
    }
    const data = await user.toJSON();
    res.status(200).json({
        success: true,
        message: "User signed up successfully",
        data: data
    });
    // check if user already exists
    // hash password
    // save user to database
    // generate jwt token
    // send response
});