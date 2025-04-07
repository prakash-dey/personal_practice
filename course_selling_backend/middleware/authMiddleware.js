import jwt from "jsonwebtoken";
import User from "../models/user";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Unauthorized access" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decoded;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize = (roles = []) = async (req,res,next) =>{
    if(!roles.includes(req.user.roe)){
        return res.status(403).json({message : "Forbidded"});
    }
    next();
}
