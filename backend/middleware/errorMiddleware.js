import { response } from "express";

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // special error in mongodb - cast error: indicates a failure to cast an object to a valid ObjectId.
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  } 
  console.log("status", res.statusCode)
  console.log("error message: ", message)
  res.status(statusCode).json({
      message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
      
      // If production environment, don't show error stack
      // error.stack will have the information about the line of code that caused error and more
      // Above code will show stack information if it's not a production environment
  })

};

export { notFound, errorHandler }
