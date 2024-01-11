import {
    NextFunction, Request,
    Response
} from "express";
import {ValidationError, validationResult} from "express-validator";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const formattedErrors = validationResult(req).formatWith((error: ValidationError) => {
        return {
            message: error.msg,
            field: error.type === 'field' ? error.path : null
        }
    });


    return next();
}
