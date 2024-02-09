"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamValidationMiddleware = exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const common_1 = require("../../models/common");
const { BAD_REQUEST, NOT_FOUND } = common_1.HTTP_STATUSES;
const inputValidationMiddleware = (req, res, next) => {
    // формирование массива ошибок
    const formattedErrors = (0, express_validator_1.validationResult)(req).formatWith((error) => {
        return error.type === 'field' ? ({ message: error.msg, field: error.path }) : null;
    });
    if (!formattedErrors.isEmpty()) {
        const errorMessage = formattedErrors.array({ onlyFirstError: true });
        const errors = { errorsMessages: errorMessage };
        console.error(errors);
        res.status(BAD_REQUEST).send(errors);
        return;
    }
    return next();
};
exports.inputValidationMiddleware = inputValidationMiddleware;
const idParamValidationMiddleware = (req, res, next) => {
    const formattedErrors = (0, express_validator_1.validationResult)(req).formatWith((error) => {
        return error.type === 'field' ? ({ message: error.msg, field: error.path }) : null;
    });
    if (!formattedErrors.isEmpty()) {
        if (formattedErrors.array().find(el => (el === null || el === void 0 ? void 0 : el.field) === 'postId')) {
            const errors = { errorsMessages: [{ message: 'postId must be a number', field: 'postId' }] };
            res.sendStatus(NOT_FOUND).send(errors);
            return;
        }
    }
    return next();
};
exports.idParamValidationMiddleware = idParamValidationMiddleware;
