import {
    NextFunction, Request,
    Response
} from "express";
import {ValidationError, validationResult} from "express-validator";
import {HTTP_STATUSES, idKeys, Param, RequestParamType, RequestWithQueryType} from "../../models/common";
import {ObjectId} from "mongodb";

const { BAD_REQUEST, NOT_FOUND} = HTTP_STATUSES

export const mongoIdValidation = (req: RequestParamType<Param<'id' | 'postId' | 'blogId'>>, res: Response, next: NextFunction) => {
    const keysToCheck: Array<keyof idKeys> = ['id', 'postId', 'blogId'];
    for (const key of keysToCheck) {
        if (req.params[key] && !ObjectId.isValid(req.params[key])) {
            return res.sendStatus(BAD_REQUEST);
        }
    }
    return next();
}
export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    // формирование массива ошибок
    const formattedErrors = validationResult(req).formatWith((error: ValidationError) => {
        return error.type === 'field' ? ({message: error.msg, field: error.path}) : null;
    });

    if (!formattedErrors.isEmpty()) {
        const errorMessage = formattedErrors.array({onlyFirstError: true});
        const errors = {errorsMessages: errorMessage};
        res.status(403).send(errors);
        return;
    }

    return next();
}

