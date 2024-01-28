import {
    NextFunction, Request,
    Response
} from "express";
import {ValidationError, validationResult} from "express-validator";
import {HTTP_STATUSES} from "../../models/common";

const { BAD_REQUEST} = HTTP_STATUSES

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    // формирование массива ошибок
    const formattedErrors = validationResult(req).formatWith((error: ValidationError) => {
        return error.type === 'field' ? ({message: error.msg, field: error.path}) : null;
    });

    if (!formattedErrors.isEmpty()) {
        const errorMessage = formattedErrors.array({onlyFirstError: true});
        const errors = {errorsMessages: errorMessage};
        console.error(errors);
        res.status(BAD_REQUEST).send(errors);
        return;
    }

    return next();
}
