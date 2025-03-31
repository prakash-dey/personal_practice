import asyncHandler from "../utils/asyncHandler";

export const  signup = asyncHandler(async(req, res) => {
    // get user data from request body
    const { name, email, password } = req.body;
    // do validation using zod
    
    // check if user already exists
    // hash password
    // save user to database
    // generate jwt token
    // send response
});