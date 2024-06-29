import express, { Application, NextFunction, Express } from "express";
import { ApiResponse, ApiRequest } from "types/Api";
import compression from "compression" // compresses requests
import cookieParser from "cookie-parser" // parses cookie header and populates req.cookies
import apiRoutes from '../route/api';
import { cacheMiddleware, invalidateCacheMiddleware } from '../utils/mongooseCache';

import helmet from "helmet" // sets HTTP headers to protect from well-known web vulnerabilities
import morgan from "morgan" // HTTP request logger middleware for node.js
import cors from 'cors';
import rateLimit from "express-rate-limit"; // rate limiting middleware

const handlerError = (error: any, req: ApiRequest, res: ApiResponse<unknown>) => {
  console.error({
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query, 
    params: req.params
  });

  res.status(500).json({
    message: "Internal server error",
    status: "error"
  })
}

const handlerInfoRoute = (req: ApiRequest, _: ApiResponse<unknown>, next: NextFunction) => {
  console.log({
    message: "Request received",
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query, 
    params: req.params
  });
  next();
}

const handlerNotFound = (_: ApiRequest, res: ApiResponse<unknown>) => {
  return res.status(404).json({
    message: "Resource not found",
    status: "error"
  });
}

const handlerPath = (app: Express) => (_: ApiRequest, res: ApiResponse<{
  path: string 
}>) => {
  try{
    const routes = getRoutes(app);
    const typeString = generateTypeString(routes);
    res.status(200).json({
      status: "success",
      data: {
        path: typeString
      }
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      status: "error"
    });
  }
};


const ExpressConfig = (): Application => {
  const app = express()
  app.use(compression()) // Compress all routes 
  app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies
  app.use(express.json()) // Parse JSON bodies

  app.use(helmet()) // Secure Express apps by setting various HTTP headers
  app.use(cookieParser()) // Parse Cookie header and populate req.cookies with an object keyed by the cookie names
  app.use(morgan("dev")) // HTTP request logger middleware for node.js

  app.use(cors()); // Enable All CORS Requests

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after an hour"
  });
  app.use(limiter);
  
  app.use(handlerInfoRoute);
  
  app.use(handlerError);

  app.use(cacheMiddleware);

  app.use(invalidateCacheMiddleware);

  app.use('/api', apiRoutes);
  
  app.get('/api/v1/path', handlerPath(app));

  app.use(handlerNotFound);


  return app
}



export default ExpressConfig;