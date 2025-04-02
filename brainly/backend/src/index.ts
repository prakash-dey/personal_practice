import express from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes";
import contentRouter from "./routes/contentRoutes";
import errorHandler from "./middlewares/errorMiddleware";
import shareRouter from "./routes/shareRoutes";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

console.log("Index.ts called");
app.use("/api/v1/user", userRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/share", shareRouter);
app.get("/api/v1/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Test API is working",
  });
});


app.use(errorHandler);
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
