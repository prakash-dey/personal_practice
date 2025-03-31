import { NextFunction, Request,Response } from "express";

const errorHandler = (error: any, req: Request , res:Response, next: NextFunction) => {
    console.log('error:',error,error.message );
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

export default errorHandler;