import { Service } from "typedi";
import { NextFunction, Response } from "express";
import { Middleware, ExpressErrorMiddlewareInterface, BadRequestError } from "routing-controllers";
import { LoggerService } from "../services";

@Service()
@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
    constructor(protected logger: LoggerService) {}
    public error(error: any, req: Request, res: Response, next: NextFunction): void {
        let {
            message = 'Something went wrong. Please try again.',
            httpCode,
            statusCode = 500,
        } = error;

        this.logger.logError(message);

        console.log(error);
        

        let errors = [];
        if (error instanceof BadRequestError) {
            errors = (error as any).errors.map((error: any) => error.constraints[Object.keys(error.constraints)[0]]);
            message = 'Bad Request';
        }

        statusCode = httpCode || statusCode;
        res.status(statusCode).json({
            statusCode,
            message,
            ...(errors.length ? { errors } : {})
        });
    }
}