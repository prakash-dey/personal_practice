import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ErrorResponse from "../utils/errorResponse";
import { signinValidation, signupValidation } from "../utils/validator";
import UserModel from "../model/UserModel";

const sendTokenResponse = async function (
  user: any,
  statusCode: number,
  res: Response
) {
  const token = await user.generateJwtToken();
  const options = {
    expires: new Date(
      Date.now() + 1* 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token",token,options).json({success:true,token})
};
export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    const validation = signupValidation({ name, email, password });
    if (!validation.success) {
      return next(
        new ErrorResponse(validation.error.errors[0].message as string, 400)
      );
    }

    const isUserExistsAlready = await UserModel.findOne({ email });
    if (isUserExistsAlready) {
      return next(new ErrorResponse("User already exists", 400));
    }
    const user = await UserModel.create({ name, email, password });
    if (!user) {
      return next(new ErrorResponse("User not created", 400));
    }

    const data = await user.toJSON();
    sendTokenResponse(user,200,res);
  }
);

export const signin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // get data from req body
    const { email, password } = req.body;
    // do validation
    const validation = signinValidation({ email, password });
    if (!validation.success) {
      return next(
        new ErrorResponse(validation.error.errors[0].message as string, 400)
      );
    }
    // Get the user
    const user = await UserModel.findOne({ email });
    if (!user) return next(new ErrorResponse("User does not exists", 400));
    // check if password is correct
    const isPasswordValid = await (user as any).comparePassword(password);
    if(!isPasswordValid){
        return next(new ErrorResponse("Invalid credentials",401))
    }
    sendTokenResponse(user,200,res);
  }
);
