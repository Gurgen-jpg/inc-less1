import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";
import {BlogRepository} from "../repositories/blog-repository";
import {BlogQueryRepository} from "../repositories/blog-query-repository";

const POST_VALIDATION_FIELDS = {
    title: 'title',
    shortDescription: 'shortDescription',
    content: 'content',
    blogId: 'blogId',
    id: 'id'
} as const;

const {title, shortDescription, content, blogId, id} = POST_VALIDATION_FIELDS;

const postTitleValidation = body(title)
    .isString()
    .withMessage('title must be a string')
    .trim()
    .isLength({min: 1, max: 30})
    .withMessage('title must be between 1 and 30 characters');

const shortDescriptionValidation = body(shortDescription)
    .isString()
    .withMessage('shortDescription must be a string')
    .trim()
    .isLength({min: 1, max: 100})
    .withMessage('shortDescription must be between 1 and 100 characters');

const contentValidation = body(content)
    .isString()
    .withMessage('content must be a string')
    .trim()
    .isLength({min: 1, max: 1000})
    .withMessage('content must be between 1 and 1000 characters');


const checkBlogId = body(blogId)
    .custom(async (blogId) => {
        const blog = await BlogQueryRepository.getBlogById(blogId);
        if (!blog) {
            throw new Error('blog name not found, wrong blogId or blog not exists');
        }
    })
    .withMessage('blog name not found, wrong blogId or blog not exists');

export const postInputValidation = () => {
    return [
        postTitleValidation,
        shortDescriptionValidation,
        contentValidation,
        checkBlogId,
        inputValidationMiddleware
    ]
}
export const createPostFromBlogValidation = () => {
    return [
        postTitleValidation,
        shortDescriptionValidation,
        contentValidation,
        inputValidationMiddleware
    ]
}
