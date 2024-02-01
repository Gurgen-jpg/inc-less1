import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";

const validationFields = {
    login: 'login',
    password: 'password',
    email: 'email'
} as const;

const loginValidation = body(validationFields.login)
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Login must be a non-empty string')
    .isLength({min: 3, max: 10})
    .withMessage('Login must be between 3 and 10 characters')
    .matches('^[a-zA-Z0-9_-]*$')
    .withMessage('Login must contain only latin letters, numbers, underscores and dashes');

const passwordValidation = body(validationFields.password)
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Password must be a non-empty string')
    .isLength({min: 6, max: 20})
    .withMessage('Password must be between 6 and 20 characters');

const emailValidation = body(validationFields.email)
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Email must be a non-empty string')
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    .withMessage('Email must be a valid email');

export const usersValidation = () => [
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware
];
