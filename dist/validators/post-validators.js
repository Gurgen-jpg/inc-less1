"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostFromBlogValidation = exports.postInputValidation = exports.checkBlogId = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const blog_query_repository_1 = require("../repositories/blog-query-repository");
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
exports.checkBlogId = (0, express_validator_1.body)(blogId)
    .custom((blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_query_repository_1.BlogQueryRepository.getBlogById(blogId);
    if (!blog) {
        throw new Error('blog name not found, wrong blogId or blog not exists');
    }
}))
    .withMessage('blog name not found, wrong blogId or blog not exists');
const postInputValidation = () => {
    return [
        postTitleValidation,
        shortDescriptionValidation,
        contentValidation,
        exports.checkBlogId,
        input_validation_middleware_1.inputValidationMiddleware
    ];
};
exports.postInputValidation = postInputValidation;
const createPostFromBlogValidation = () => {
    return [
        postTitleValidation,
        shortDescriptionValidation,
        contentValidation,
        input_validation_middleware_1.inputValidationMiddleware
    ];
};
exports.createPostFromBlogValidation = createPostFromBlogValidation;
