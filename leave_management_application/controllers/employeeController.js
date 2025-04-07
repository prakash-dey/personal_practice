import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";

console.log(User);
const sendTokenResponse = async (user, statusCode, res) => {
  const token = await user.getJwtSigned();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("User not found", 401));
  }
  console.log(user, password);
  const isCredsValid = await user.validatePassword(password);
  if (!isCredsValid) {
    return next(new ErrorResponse("Invalid credentilas", 401));
  }
  sendTokenResponse(user, 200, res);
});

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  
  if (!email) {
    return next(new ErrorResponse("Email is required", 400));
  }
  try {
    const user = await User.create({ name, email, password, role });
    sendTokenResponse(user, 201, res);
  } catch (err) {
    if (err.code == "11000") {
      return next(new ErrorResponse("User already exists", 403));
    }
    next(err);
  }
});

export const logout = asyncHandler(async (req, res, next) => {
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
  };
  res.status(200).cookie("token", "none", options).json({
    success: true,
    data: {},
  });
});

export const loggedInUser = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true, data: req.user });
});
