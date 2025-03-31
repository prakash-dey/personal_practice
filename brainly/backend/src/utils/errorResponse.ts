import ts from "typescript";

class ErrorResponse extends Error {
    constructor(message : string, statusCode:number) {
      super(message);
    //   @ts-ignore
    this.statusCode = statusCode;
    //   @ts-ignore
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    //   @ts-ignore
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export default ErrorResponse;