"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = exports.mongoIdValidation = void 0;
const express_validator_1 = require("express-validator");
const common_1 = require("../../models/common");
const mongodb_1 = require("mongodb");
const { BAD_REQUEST, NOT_FOUND } = common_1.HTTP_STATUSES;
const mongoIdValidation = (req, res, next) => {
    const keysToCheck = ['id', 'postId', 'blogId'];
    for (const key of keysToCheck) {
        if (req.params[key] && !mongodb_1.ObjectId.isValid(req.params[key])) {
            return res.sendStatus(BAD_REQUEST);
        }
    }
    return next();
};
exports.mongoIdValidation = mongoIdValidation;
const inputValidationMiddleware = (req, res, next) => {
    // формирование массива ошибок
    const formattedErrors = (0, express_validator_1.validationResult)(req).formatWith((error) => {
        return error.type === 'field' ? ({ message: error.msg, field: error.path }) : null;
    });
    if (!formattedErrors.isEmpty()) {
        const errorMessage = formattedErrors.array({ onlyFirstError: true });
        const errors = { errorsMessages: errorMessage };
        res.status(BAD_REQUEST).send(errors);
        return;
    }
    return next();
};
exports.inputValidationMiddleware = inputValidationMiddleware;
