import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/errorResponse.js";
import User from "../models/User.js";

export const protect = async (req,res,next) =>{
    const token = req.cookies["token"];
    
    if(!token){
        return next(new ErrorResponse("Not authorized to access this route",401));
    }
    const decodedUser = jwt.verify(token,process.env.JWT_SECRET);
    const user = await User.findById(decodedUser._id);
    if(!user){
        return next(new ErrorResponse("Not authorized to access this route",401));
    }
    req.user = user;
    next();
} 
export const authorize = (roles = []) =>  async (req,res,next) =>{
    const role = req.user.role;
    if(!roles.includes(role)){
        return next(new ErrorResponse("Unauthorized access", 403));
    }
    next();
}