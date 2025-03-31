import { Request, Response, NextFunction }  from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../utils/asyncHandler';
import UserModel from '../model/UserModel';


export const authMiddleware = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if(!token) next(new ErrorResponse("Not authorized to access this route", 401));
    const decoded : any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await UserModel.findById(decoded._id).select("-password");
    if(!user) next(new ErrorResponse("Not authorized to access this route", 401));
    if(typeof user === "string"){
       return  next(new ErrorResponse("Not authorized to access this route", 401));
    }
    // @ts-ignore
    req.user = user;
    next();
})
