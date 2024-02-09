import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";

const validationFields = {
    content: 'content'
} as const
const contentValidation = body(validationFields.content)
    .isString()
    .withMessage('content must be string')
    .trim()
    .notEmpty()
    .isLength({min: 20, max: 300})
    .withMessage('content length must be between 20 and 300')
export const commentInputValidation = () => [
    contentValidation,
    inputValidationMiddleware
]
