import {Router, Response} from "express";
import {authMiddleware} from "../middlewares/authValidation/auth-middleware";
import {
    HTTP_STATUSES, PaginationType, Param,
    RequestBodyType,
    RequestBodyWithParamsType, RequestParamAndQueryType,
    RequestParamType,
    RequestWithQueryType
} from "../models/common";
import {blogsValidation} from "../validators/blog-validators";
import {BlogInputModel} from "../models/blogs/input";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";
import {BlogServices} from "../domain/blog-services";
import {BlogViewModel} from "../models/blogs/output";
import {BlogQueryRepoInputModel} from "../models/blogs/blogQueryRepoInputModel";
import {PostInputModel} from "../models/posts/input";
import {createPostFromBlogValidation} from "../validators/post-validators";
import {ObjectId} from "mongodb";
import {PostQueryRepoInputModel} from "../models/posts/postQueryRepoInputModel";


export const blogRoute = Router();

const {OK, CREATED, NO_CONTENT, NOT_FOUND, BAD_REQUEST} = HTTP_STATUSES;

blogRoute.get("/", async (req: RequestWithQueryType<BlogQueryRepoInputModel>, res: Response<PaginationType<BlogViewModel> | null>) => {
    const {
        searchNameTerm = null,
        sortBy = 'createdAt',
        sortDirection = 'desc',
        pageNumber = 1,
        pageSize = 10
    } = req.query;

    const allBlogs = await BlogServices.getAllBlogs({searchNameTerm, sortBy, sortDirection, pageNumber, pageSize});
    res.status(OK).send(allBlogs);
});

blogRoute.get("/:id", inputValidationMiddleware, async (req: RequestParamType<Param>, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.sendStatus(NOT_FOUND);
    }
    const blog = await BlogServices.getBlogById(req.params.id);
    return blog ? res.status(OK).send(blog) : res.sendStatus(NOT_FOUND);
});

blogRoute.get("/:blogId/posts", inputValidationMiddleware, async (req: RequestParamAndQueryType<{blogId: string}, PostQueryRepoInputModel>, res: Response) => {
    if (!ObjectId.isValid(req.params.blogId)) {
        return res.sendStatus(NOT_FOUND);
    }
    const posts = await BlogServices.getPostsByBlogId({...req.query, blogId: req.params.blogId});
    return posts ? res.status(OK).send(posts) : res.sendStatus(NOT_FOUND);
});



blogRoute.post("/", authMiddleware, blogsValidation(), async (req: RequestBodyType<BlogInputModel>, res: Response) => {
    let newBlog = await BlogServices.addBlog(req.body);
    res.status(CREATED).send(newBlog);
});

blogRoute.post("/:blogId/posts", authMiddleware, createPostFromBlogValidation(), async (req: RequestBodyWithParamsType<{blogId: string}, PostInputModel>, res: Response) => {
    if (!ObjectId.isValid(req.params.blogId)) {
        return res.sendStatus(NOT_FOUND);
    }
    let newPost = await BlogServices.addPostByBlogId({...req.body, blogId: req.params.blogId});
    return res.status(CREATED).send(newPost);
});


blogRoute.put("/:id", authMiddleware, blogsValidation(), async (req: RequestBodyWithParamsType<{
    id: string
}, BlogInputModel>, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.sendStatus(NOT_FOUND);
    }
    const blogIsUpdate = await BlogServices.updateBlog(req.params.id, req.body);
    return blogIsUpdate ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
});

blogRoute.delete("/:id", authMiddleware, inputValidationMiddleware, async (req: RequestParamType<{
    id: string
}>, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.sendStatus(NOT_FOUND);
    }
    const blogIsDelete = await BlogServices.deleteBlog(req.params.id);
    return blogIsDelete ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
})
