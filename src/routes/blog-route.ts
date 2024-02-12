import {Router, Response} from "express";
import {
    HTTP_STATUSES, PaginationType, Param,
    RequestBodyType,
    RequestBodyWithParamsType, RequestParamAndQueryType,
    RequestParamType,
    RequestWithQueryType
} from "../models/common";
import {blogsValidation} from "../validators/blog-validators";
import {BlogInputModel} from "../models/blogs/input";
import {inputValidationMiddleware, mongoIdValidation} from "../middlewares/inputValidation/input-validation-middleware";
import {BlogServices} from "../domain/blog-services";
import {BlogViewModel} from "../models/blogs/output";
import {BlogQueryRepoInputModel} from "../models/blogs/blogQueryRepoInputModel";
import {PostInputModel} from "../models/posts/input";
import {createPostFromBlogValidation} from "../validators/post-validators";
import {ObjectId} from "mongodb";
import {PostQueryRepoInputModel} from "../models/posts/postQueryRepoInputModel";
import {basicAuthorizationMiddleware} from "../middlewares/authValidation/basic-authorization";


export const blogRoute = Router();

const {OK, CREATED, NO_CONTENT, NOT_FOUND, BAD_REQUEST} = HTTP_STATUSES;

blogRoute.get("/", async (req: RequestWithQueryType<BlogQueryRepoInputModel>, res: Response<PaginationType<BlogViewModel> | null>) => {
    const allBlogs = await BlogServices.getAllBlogs(req.query);
    return allBlogs ? res.status(OK).send(allBlogs) : res.sendStatus(NOT_FOUND);
});

blogRoute.get("/:id", mongoIdValidation, inputValidationMiddleware, async (req: RequestParamType<Param<'id'>>, res: Response) => {
    const blog = await BlogServices.getBlogById(req.params.id);
    return blog ? res.status(OK).send(blog) : res.sendStatus(NOT_FOUND);
});

blogRoute.get("/:blogId/posts", mongoIdValidation, inputValidationMiddleware, async (req: RequestParamAndQueryType<Param<'blogId'>, PostQueryRepoInputModel>, res: Response) => {
    const posts = await BlogServices.getPostsByBlogId({...req.query, blogId: req.params.blogId});
    return posts ? res.status(OK).send(posts) : res.sendStatus(NOT_FOUND);
});


blogRoute.post("/", basicAuthorizationMiddleware, blogsValidation(), async (req: RequestBodyType<BlogInputModel>, res: Response) => {
    let newBlog = await BlogServices.addBlog(req.body);
    return newBlog ? res.status(CREATED).send(newBlog) : res.sendStatus(BAD_REQUEST);
});

blogRoute.post("/:blogId/posts", mongoIdValidation, basicAuthorizationMiddleware, createPostFromBlogValidation(), async (req: RequestBodyWithParamsType<Param<'blogId'>, PostInputModel>, res: Response) => {
    let newPost = await BlogServices.addPostByBlogId({...req.body, blogId: req.params.blogId});
    newPost ? res.status(CREATED).send(newPost) : res.sendStatus(NOT_FOUND);
});


blogRoute.put("/:id", mongoIdValidation, basicAuthorizationMiddleware, blogsValidation(), async (req: RequestBodyWithParamsType<Param<'id'>, BlogInputModel>, res: Response) => {
    const blogIsUpdate = await BlogServices.updateBlog(req.params.id, req.body);
    return blogIsUpdate ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
});

blogRoute.delete("/:id", mongoIdValidation, basicAuthorizationMiddleware, inputValidationMiddleware, async (req: RequestParamType<Param<'id'>>, res: Response) => {
    const blogIsDelete = await BlogServices.deleteBlog(req.params.id);
    return blogIsDelete ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
})
