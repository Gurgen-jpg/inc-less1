import {RegisterInputModel} from "../models/auth/input";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";

const fields: RegisterInputModel = {
    login: 'login',
    email: 'email',
    password: 'password',
} as const;

const loginValidation = body(fields.login)
    .isString()
    .trim()
    .isLength({min: 3, max: 30})
    .withMessage('field must be between 3 and 30 characters')
    .matches('^[a-zA-Z0-9_-]*$')
    .withMessage('field must contain only english letters, numbers, underscores and dashes');
const emailValidation = body(fields.email)
    .isString()
    .trim()
    .exists()
    .withMessage('field must be a string')
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    .withMessage('field must be an email');
const passwordValidation = body(fields.password)
    .isString()
    .trim()
    .isLength({min: 6, max: 20})
    .withMessage('field must be between 6 and 20 characters');

export const registerValidation = () => {
    return [loginValidation, emailValidation, passwordValidation, inputValidationMiddleware];
}

const confirmCodeValidation = body('code')
    .trim()
    .notEmpty()
    .withMessage('field must not be empty')
export const emailConfirmationValidation = () => {
    return [confirmCodeValidation, inputValidationMiddleware];
}

export const resendEmailValidation = () => {
    return [emailValidation, inputValidationMiddleware];
}

