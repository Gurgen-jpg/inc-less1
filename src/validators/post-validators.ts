import {body, param} from "express-validator";
import {db} from "../db/db";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";


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
    .isString()
    .withMessage('blogId must be a string')
    .notEmpty()
    .withMessage('blogId is required')
    .custom((blogId) => {
        return !!db.blogs.find(blog => blog.id === blogId);
    })
    .withMessage('blog name not found, wrong blogId or blog not exists');

export const  postInputValidation = () => {
    return [
        postTitleValidation,
        shortDescriptionValidation,
        contentValidation,
        checkBlogId,
        inputValidationMiddleware
    ]
}

export const checkId = param(id)
    .isString()
    .withMessage('id must be a string')
    .notEmpty()
    .withMessage('id is required')
    .custom((id) => {
        return !!db.posts.find(post => post.id === id);
    })
    .withMessage('post not found');
