import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";

const validationKeys = {
    loginOrEmail: 'loginOrEmail',
    password: 'password'
} as const;
const authEmailOrLoginValidation = body(validationKeys.loginOrEmail)
    .isString()
    .trim()
    .notEmpty()
    .withMessage('loginOrEmail is invalid');

const authPasswordValidation = body(validationKeys.password)
    .isString()
    .trim()
    .notEmpty()
    .withMessage('password is invalid');

export const authValidation = () => [
    authEmailOrLoginValidation,
    authPasswordValidation,
    inputValidationMiddleware
]
