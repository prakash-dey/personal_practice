import Course from "../models/Course.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";

export const createCourse = asyncHandler(async (req,res,next)=>{
    const instructor = req.user._id;
    const {title,description,price,thumbnail,content} = req.body;
    const course = await Course.create({title,description,price,thumbnail,instructor,content});
    if(!course){
        return next(new ErrorResponse("Could not create the course", 500));
    }
    return res.status(200).json({success: true,course});
});

export const getAllCourses = asyncHandler(async (req,res,next)=>{
    const courses = await Course.find().populate({
        path:"instructor",
        select:"name email"
    });
    return res.status(200).json({
        success: true,
        count: courses.length,
        courses
    })
});

export const getCourse = asyncHandler(async (req,res,next)=>{

    const course = await Course.findById(req.params.id).populate({
        path:"instructor",
        select: "name email"
    });

    if(!course){
        return next(new ErrorResponse("No course found"),404);
    }
    return res.status(200).json({
        success: true,
        course
    })
});

