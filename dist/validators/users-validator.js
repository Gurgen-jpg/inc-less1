"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const validationFields = {
    login: 'login',
    password: 'password',
    email: 'email'
};
const loginValidation = (0, express_validator_1.body)(validationFields.login)
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Login must be a non-empty string')
    .isLength({ min: 3, max: 10 })
    .withMessage('Login must be between 3 and 10 characters')
    .matches('^[a-zA-Z0-9_-]*$')
    .withMessage('Login must contain only latin letters, numbers, underscores and dashes');
const passwordValidation = (0, express_validator_1.body)(validationFields.password)
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Password must be a non-empty string')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be between 6 and 20 characters');
const emailValidation = (0, express_validator_1.body)(validationFields.email)
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Email must be a non-empty string')
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    .withMessage('Email must be a valid email');
const usersValidation = () => [
    loginValidation,
    passwordValidation,
    emailValidation,
    input_validation_middleware_1.inputValidationMiddleware
];
exports.usersValidation = usersValidation;
