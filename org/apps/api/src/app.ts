import express, { Application, NextFunction } from "express";
import compression from 'compression';
import { ApiResponse, ApiRequest } from "./types/Api";
import { ERRORS } from './constants/MESSAGE';

import { CustomError, usedCodesErrors } from './helpers/error/CustomError';
import { Error } from 'mongoose';

import helmet from "helmet" // sets HTTP headers to protect from well-known web vulnerabilities
import morgan from "morgan" // HTTP request logger middleware for node.js
import cors from 'cors';
import rateLimit from "express-rate-limit"; // rate limiting middleware
import cookieParser from "cookie-parser";
import { dbConnect, generateMongoUri } from "./utils/mongooseConnect";
import { createClient, RedisClientType } from 'redis';
import { REDIS_URI } from './env';
import ManagerController from "./helpers/Controller";


const redisUrl = REDIS_URI;
class Redis {
    public redisClient: RedisClientType;

    private constructor() {
        this.redisClient = createClient({ url: redisUrl });
    };
    public async connect() {
        await this.redisClient.connect().then(() => {
            console.log('Connected to Redis');
        }).catch((err: Error) => {
            console.error('Redis connection error:');
            console.error(err);
            throw err;
        });
    }
    public static create() {
        return new Redis();
    }
    // Add all the necessary redis methods here
}

class App {
    public app: Application;
    public redis: Redis;
    private constructor(controller: ManagerController, public port: number) {
        this.app = express();
        this.port = port;

        this.connectDatabase();
        this.redis = Redis.create();


        this.initMiddlewares();
        this.initRateLimit();

        this.app.use(this.handlerInfoRoute);
        this.initMiddlewaresCache();

        this.initControllers(controller);

        this.initErrorHandling();
    }
    private connectDatabase() {
        this.connectDatabaseMongoDB();
        this.connectDatabaseRedis();
    }
    private connectDatabaseMongoDB() {
        const key = generateMongoUri() || '';
        dbConnect(key).then(() => {
            console.log('db connected');
        }).catch((error: Error) => {
            console.error('Error connecting to MongoDB.');
            console.error(error);
            throw error;
        });
    }
    private connectDatabaseRedis() {
        this.redis.connect().catch((error: Error) => {
            console.error('Error connecting to Redis.');
            console.error(error);
            throw error;
        });
    }
    private initMiddlewares() {
        this.app.use(compression()); // Compress all routes
        this.app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
        this.app.use(express.json()); // Parse JSON bodies
        this.app.use(helmet()); // Secure Express apps by setting various HTTP headers
        this.app.use(morgan("dev")); // HTTP request logger middleware for node
        this.app.use(cookieParser()); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names
        this.app.use(cors()); // Enable All CORS Requests

    }
    private initRateLimit() {
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: "Too many requests from this IP, please try again after an hour"
        });
        this.app.use(limiter);
    }
    private initMiddlewaresCache() {
        // TODO: Cache middleware
    }
    private handlerInfoRoute(req: ApiRequest, _: ApiResponse<unknown>, next: NextFunction) {
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
    private handlerNotFound(_: ApiRequest, res: ApiResponse<unknown>) {
        res.status(404).json({
            message: "Resource not found",
            status: "error"
        });
    }
    private handlerError(error: Error, req: ApiRequest, res: ApiResponse<undefined>) {
        if (error instanceof CustomError) {
            const { statusCode, errors, logging } = error;
            if (logging && usedCodesErrors.includes(statusCode)) {
                console.error(JSON.stringify({
                    code: statusCode,
                    errors,
                    stack: error.stack,
                    path: req.path,
                    method: req.method,
                    body: req.body,
                    query: req.query,
                    params: req.params
                }, null, 2));
            }

            res.status(statusCode).json({
                message: errors[0].message,
                status: "error"
            });
            return;
        }

        console.error({
            ...error,
            path: req.path,
            method: req.method,
            body: req.body,
            query: req.query,
            params: req.params
        });

        res.status(500).json({
            message: ERRORS.INTERNAL_SERVER_ERROR,
            status: "error"
        });
    }
    private initErrorHandling() {
        this.app.use(this.handlerError);
        this.app.use(this.handlerNotFound);
    }
    private initControllers(controller: ManagerController) {
        this.app.use('/', controller.router);
    }
    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
    public static create(controller: ManagerController, port: number) {
        return new App(controller, port);
    }
}

export default App;

class A {
    public hello(){
        console.log('Hello from A');
    }
}

class B extends A {

}

function giveMeB(para: A) {
    para.hello();
}

giveMeB(new B());