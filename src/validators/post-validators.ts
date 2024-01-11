import {body} from "express-validator";

const titleValidator = body('name').isString().isLength({min: 1, max: 15}).withMessage('Incorrect name');

const shortDescriptionValidator = body('description')
    .isString()
    .isLength({min: 1, max: 500})
    .withMessage('Incorrect description');

const contentValidator = body('websiteUrl').isString()
    .isLength({min: 1, max: 100})
    .withMessage('Incorrect websiteUrl');

