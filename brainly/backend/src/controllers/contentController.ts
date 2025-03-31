import ContentModel from "../model/ContentModel";
import asyncHandler from "../utils/asyncHandler";
import ErrorResponse from "../utils/errorResponse";

export const addContent = asyncHandler(async (req, res) => {
    const { link,type,title,tag } = req.body;
    const content = {
        link,
        type,
        title,
        tag,
        // @ts-ignore
        userId : req.user._id
    }
    const newContent = await ContentModel.create(content);
    return res.status(201).json({
        success: true,
        message: "Content added successfully",
        data: newContent
    });
});

export const getAllContent = asyncHandler(async (req, res,next) => {
    console.log("Get all content called");
    // @ts-ignore
    const contents = await ContentModel.find({userId:req.user._id});
    console.log(contents);
    return res.status(200).json({
        success: true,
        message: "Contents fetched successfully",
        data: contents
    });
});

export const deleteContent = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    // @ts-ignore
    const content = await ContentModel.deleteOne({ _id: id },{ userId: req.user._id });
    if (!content) {
        return next(new ErrorResponse("Content not found", 404));
    }
    return res.status(200).json({
        success: true,
        message: "Content deleted successfully",
    });
});
