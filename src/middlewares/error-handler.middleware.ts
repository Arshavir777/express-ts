import { Service } from "typedi";
import { Response } from "express";
import { Middleware, ExpressErrorMiddlewareInterface, BadRequestError } from "routing-controllers";
import { LoggerService } from "../services";

@Service()
@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
    constructor(protected logger: LoggerService) { }
    public error(error: any, req: Request, res: Response): void {
        let {
            message = 'Something went wrong. Please try again.',
            statusCode = 500,
        } = error;
        const { httpCode } = error;
        this.logger.logError(message);

        let errors = [];
        if (error instanceof BadRequestError) {
            // TODO: too much any types
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