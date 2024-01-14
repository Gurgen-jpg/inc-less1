"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkId = exports.postInputValidation = void 0;
const express_validator_1 = require("express-validator");
const db_1 = require("../db/db");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const POST_VALIDATION_FIELDS = {
    title: 'title',
    shortDescription: 'shortDescription',
    content: 'content',
    blogId: 'blogId',
    id: 'id'
};
const { title, shortDescription, content, blogId, id } = POST_VALIDATION_FIELDS;
const postTitleValidation = (0, express_validator_1.body)(title)
    .isString()
    .withMessage('title must be a string')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('title must be between 1 and 30 characters');
const shortDescriptionValidation = (0, express_validator_1.body)(shortDescription)
    .isString()
    .withMessage('shortDescription must be a string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('shortDescription must be between 1 and 100 characters');
const contentValidation = (0, express_validator_1.body)(content)
    .isString()
    .withMessage('content must be a string')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('content must be between 1 and 1000 characters');
const checkBlogId = (0, express_validator_1.body)(blogId)
    .isString()
    .withMessage('blogId must be a string')
    .notEmpty()
    .withMessage('blogId is required')
    .custom((blogId) => {
    return !!db_1.db.blogs.find(blog => blog.id === blogId);
})
    .withMessage('blog name not found, wrong blogId or blog not exists');
const postInputValidation = () => {
    return [
        postTitleValidation,
        shortDescriptionValidation,
        contentValidation,
        checkBlogId,
        input_validation_middleware_1.inputValidationMiddleware
    ];
};
exports.postInputValidation = postInputValidation;
exports.checkId = (0, express_validator_1.param)(id)
    .isString()
    .withMessage('id must be a string')
    .notEmpty()
    .withMessage('id is required')
    .custom((id) => {
    return !!db_1.db.posts.find(post => post.id === id);
})
    .withMessage('post not found');
