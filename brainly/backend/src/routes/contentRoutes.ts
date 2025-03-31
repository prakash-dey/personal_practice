import express from "express";
import { addContent, deleteContent, getAllContent } from "../controllers/contentController";
import { authMiddleware } from "../middlewares/authMiddleware";
const contentRouter = express.Router();

contentRouter.post("/addContent",authMiddleware,addContent);
contentRouter.get("/getAllContent",authMiddleware,getAllContent); 
contentRouter.delete("/deleteContent",authMiddleware,deleteContent); 

export default contentRouter;

