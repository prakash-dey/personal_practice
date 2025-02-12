import { Router } from "express";
import { createCourse, getAllCourses, getCourse } from "../controllers/courseController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";
const courseRouter = Router();

courseRouter.post("/createCourse",protect,authorize(["instructor","admin"]), createCourse);
courseRouter.get("/getAllCourses",protect, getAllCourses);
courseRouter.get("/getCourse/:id",protect, getCourse);

export default courseRouter;