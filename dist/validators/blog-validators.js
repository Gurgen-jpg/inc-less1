"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkId = exports.blogsValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const db_1 = require("../db/db");
const BLOG_VALIDATION_FIELDS = {
    name: 'name',
    description: 'description',
    websiteUrl: 'websiteUrl',
    id: 'id'
};
const { name, description, websiteUrl, id } = BLOG_VALIDATION_FIELDS;
const blogTitleValidator = (0, express_validator_1.body)(name)
    .isString()
    .withMessage('name must be a string')
    .trim()
    .notEmpty()
    .withMessage('title is required')
    .isLength({ min: 1, max: 15 })
    .withMessage('title must be between 1 and 15 characters');
const descriptionValidator = (0, express_validator_1.body)(description)
    .isString()
    .withMessage('description must be a string')
    .trim()
    .notEmpty()
    .withMessage('description is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('description must be between 1 and 500 characters');
const websiteUrlValidator = (0, express_validator_1.body)(websiteUrl)
    .matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
    .withMessage('websiteUrl must be a valid url')
    .isLength({ min: 1, max: 100 })
    .withMessage('websiteUrl must be between 1 and 100 characters');
const blogsValidation = () => {
    return [
        blogTitleValidator,
        descriptionValidator,
        websiteUrlValidator,
        input_validation_middleware_1.inputValidationMiddleware
    ];
};
exports.blogsValidation = blogsValidation;
exports.checkId = (0, express_validator_1.param)(id)
    .isString()
    .withMessage('id must be a string')
    .notEmpty()
    .withMessage('id is required')
    .custom((id) => {
    return !!db_1.db.blogs.find(blog => blog.id === id);
})
    .withMessage('blog not found');
