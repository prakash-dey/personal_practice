import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { share, shareLink } from "../controllers/shareController";

const shareRouter = express.Router();
shareRouter.post("/share", authMiddleware,share);
shareRouter.get("/:shareLink",shareLink);

export default shareRouter;