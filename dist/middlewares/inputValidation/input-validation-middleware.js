"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const common_1 = require("../../models/common");
const { BAD_REQUEST } = common_1.HTTP_STATUSES;
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
