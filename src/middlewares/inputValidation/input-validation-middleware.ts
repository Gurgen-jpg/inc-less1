import {
    NextFunction, Request,
    Response
} from "express";
import {ValidationError, validationResult} from "express-validator";
import {HTTP_STATUSES} from "../../models/common";

const {NOT_FOUND, BAD_REQUEST} = HTTP_STATUSES

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {

   // кейс для проверки наличия ошибки параметра поиска по id
    validationResult(req).array().forEach((error: ValidationError) => {
        if (error.type === 'field' && error.path === 'id') {
            res.sendStatus(NOT_FOUND);
            return;
        }
    });

    // формирование массива ошибок
    const formattedErrors = validationResult(req).formatWith((error: ValidationError) => {
        return error.type === 'field' ? ({message: error.msg, field: error.path}) : null;
    });

    if (!formattedErrors.isEmpty()) {
        const errorMessage = formattedErrors.array({onlyFirstError: true});
        const errors = {errorsMessages: errorMessage};
        res.status(BAD_REQUEST).send(errors);
        return;
    }

    return next();
}
