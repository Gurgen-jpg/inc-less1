"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const validationKeys = {
    loginOrEmail: 'loginOrEmail',
    password: 'password'
};
const authEmailOrLoginValidation = (0, express_validator_1.body)(validationKeys.loginOrEmail)
    .isString()
    .trim()
    .notEmpty()
    .withMessage('loginOrEmail is invalid');
const authPasswordValidation = (0, express_validator_1.body)(validationKeys.password)
    .isString()
    .trim()
    .notEmpty()
    .withMessage('password is invalid');
const authValidation = () => [
    authEmailOrLoginValidation,
    authPasswordValidation,
    input_validation_middleware_1.inputValidationMiddleware
];
exports.authValidation = authValidation;
