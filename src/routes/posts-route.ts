import {Router, Request, Response} from "express";
import {
    CommentsSortDataType,
    HTTP_STATUSES,
    RequestBodyWithParamsType,
    RequestParamAndQueryType,
    RequestWithQueryType
} from "../models/common";
import {checkPostIdValidation, postInputValidation} from "../validators/post-validators";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";
import {PostServices} from "../domain/post-services";
import {PostQueryRepoInputModel} from "../models/posts/postQueryRepoInputModel";
import {ObjectId} from "mongodb";
import {basicAuthorizationMiddleware} from "../middlewares/authValidation/basic-authorization";
import {tokenAuthorizationMiddleware} from "../middlewares/authValidation/token-authorization";
import {commentInputValidation} from "../validators/comment-validation";
import {CommentInputModel} from "../models/comments/input";
import {sortParamsMiddleware} from "../middlewares/inputValidation/sortParamsMiddleware";

export const postRoute = Router({});

const {OK, CREATED, NO_CONTENT, NOT_FOUND} = HTTP_STATUSES
postRoute.get("/", async (req: RequestWithQueryType<PostQueryRepoInputModel>, res: Response) => {
    const posts = await PostServices.getAllPosts(req.query);
    res.status(OK).send(posts);
});

postRoute.get("/:id", inputValidationMiddleware, async (req: Request, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.sendStatus(NOT_FOUND);
    }
    const post = await PostServices.getPostById(req.params.id);
    return post ? res.status(200).send(post) : res.sendStatus(NOT_FOUND);
});

postRoute.post("/", basicAuthorizationMiddleware, postInputValidation(), async (req: Request, res: Response) => {
    const newPost = await PostServices.addPost(req.body);
    res.status(CREATED).send(newPost);
});

postRoute.put("/:id", basicAuthorizationMiddleware, postInputValidation(), async (req: Request, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.sendStatus(NOT_FOUND);
    }
    const postIsUpdate = await PostServices.updatePost(req.params.id, req.body);
    return postIsUpdate ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
});

postRoute.delete("/:id", basicAuthorizationMiddleware, async (req: Request, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.sendStatus(NOT_FOUND);
    }
    const postIsDelete = await PostServices.deletePost(req.params.id);
    return postIsDelete ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
})
postRoute.post("/:postId/comments",
    tokenAuthorizationMiddleware,
    commentInputValidation(),
    async (req: RequestBodyWithParamsType<{
        postId: string
    }, CommentInputModel>, res: Response) => {
        if (!ObjectId.isValid(req.params.postId)) {
            return res.sendStatus(NOT_FOUND);
        }
        const comment = await PostServices.createComment(req.params.postId, req.body.content, req.context.user!.id!);
        return comment ? res.status(CREATED).send(comment) : res.sendStatus(NOT_FOUND);
    })

postRoute.get("/:postId/comments",
    checkPostIdValidation(),
    sortParamsMiddleware,
    async (req: RequestParamAndQueryType<{
        postId: string
    }, CommentsSortDataType>, res: Response) => {
        if (!ObjectId.isValid(req.params.postId)) {
            console.log('not valid postId: ', req.params.postId);
            return res.sendStatus(NOT_FOUND);
        }

        const sortData = {
            sortBy: req.query.sortBy ?? 'createdAt',
            sortDirection: req.query.sortDirection ?? 'desc',
            pageSize: req.query.pageSize ? +req.query.pageSize : 10,
            pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        }
        const comments = await PostServices.getCommentsByPostId(req.params.postId, sortData);
        return comments ? res.status(OK).send(comments) : res.sendStatus(NOT_FOUND);
    });

