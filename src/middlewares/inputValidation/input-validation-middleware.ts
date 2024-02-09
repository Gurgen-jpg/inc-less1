import {
    NextFunction, Request,
    Response
} from "express";
import {ValidationError, validationResult} from "express-validator";
import {HTTP_STATUSES} from "../../models/common";

const { BAD_REQUEST, NOT_FOUND} = HTTP_STATUSES

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

export const idParamValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const formattedErrors = validationResult(req).formatWith((error: ValidationError) => {
        return error.type === 'field' ? ({message: error.msg, field: error.path}) : null;
    })

    if (!formattedErrors.isEmpty()) {
        if (formattedErrors.array().find(el => el?.field === 'postId')) {
            const errors = {errorsMessages: [{message: 'postId must be a number', field: 'postId'}]}
            res.sendStatus(NOT_FOUND).send(errors);
            return
        }
    }
    return next()
}
