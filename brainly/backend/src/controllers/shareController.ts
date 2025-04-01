import ContentModel from "../model/ContentModel";
import LinkModel from "../model/LinkModel";
import asyncHandler from "../utils/asyncHandler";
import ErrorResponse from "../utils/errorResponse";
import randomString from "../utils/randomString";

export const share = asyncHandler(async (req, res,next) => {
    const {share} = req.body;
    if (share) {
        // @ts-ignore
        const isLinkExists = await LinkModel.findOne({userId:req.user._id});
        if(isLinkExists){
            return res.status(200).json({
                success: true,
                message: "Link created successfully",
                hash : isLinkExists.hash
            });;
        }
        let hash = randomString(10);
        const link = await LinkModel.create({
            hash,
            // @ts-ignore
            userId: req.user._id
        });
        if (!link) {
            return next(new ErrorResponse("Link not created", 400));
        }

        res.status(200).json({
            success: true,
            message: "Link created successfully",
            hash
        });
    }else{
        // @ts-ignore
        await LinkModel.deleteOne({userId:req.user._id});
        res.status(200).json({
            success: true,
            message: "Link deleted successfully"
        });
    }
});

export const shareLink = asyncHandler(async (req, res,next) => {
    const hash = req.params.shareLink;
    if(!hash){
        return next(new ErrorResponse("Hash not found", 400));
    }
    const link = await LinkModel.findOne({hash});
    if(!link){
        return next(new ErrorResponse("Link not found", 400));
    }
    const content = await ContentModel.find({userId:link.userId}).populate("userId","-password");

    if(!content){
        return next(new ErrorResponse("Content not found", 400));
    }
    res.status(200).json({
        success: true,
        message: "Link found successfully",
        content
    });
});