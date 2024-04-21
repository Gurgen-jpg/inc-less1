import express, {Response} from "express";
import {tokenAuthorizationMiddleware} from "../middlewares/authValidation/token-authorization";
import {HTTP_STATUSES, Param, RequestBodyWithParamsType, RequestParamType} from "../models/common";
import {mongoIdValidation} from "../middlewares/inputValidation/input-validation-middleware";
import {CommentInputModel, CommentLikeInputModel} from "../models/comments/input";
import {CommentRepository} from "../repositories/comment-repository";
import {CommentService} from "../domain/comment-service";
import {commentInputValidation} from "../validators/comment-validation";

export const commentsRoute = express.Router({});
const {OK, NO_CONTENT, NOT_FOUND, FORBIDDEN} = HTTP_STATUSES;
commentsRoute.delete('/:id', mongoIdValidation, tokenAuthorizationMiddleware, async (req: RequestParamType<Param<'id'>>, res: Response) => {
    const isDeleted = await CommentService.deleteComment(req.params.id, req.context.user!);
    if (isDeleted.statusCode === 404) {
        return res.sendStatus(NOT_FOUND);
    }
    if (isDeleted.statusCode === 403) {
        return res.sendStatus(FORBIDDEN);
    }
    // return isDeleted ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);

        return res.sendStatus(NO_CONTENT);

})
commentsRoute.put('/:id', mongoIdValidation, tokenAuthorizationMiddleware, commentInputValidation(), async (req: RequestBodyWithParamsType<Param<'id'>, CommentInputModel>, res: Response) => {
    const isUpdate = await CommentService.updateComment(req.params.id, req.body.content, req.context.user!);
    if (isUpdate.statusCode === 404) {
        return res.sendStatus(NOT_FOUND);
    }
    if (isUpdate.statusCode === 403) {
        return res.sendStatus(FORBIDDEN);
    }
    return res.sendStatus(NO_CONTENT);
    // return isUpdate ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
})

commentsRoute.put('/:id/like-status', mongoIdValidation, tokenAuthorizationMiddleware, async (req: RequestBodyWithParamsType<Param<'id'>, CommentLikeInputModel>, res: Response) => {
    const isUpdate = await CommentService.updateCommentLikeStatus({
        commentId: req.params.id,
        likeStatus: req.body.likeStatus,
        userId: req.context.user!.id!
    });
})
commentsRoute.get('/:id', mongoIdValidation, async (req: RequestBodyWithParamsType<Param<'id'>, CommentInputModel>, res: Response) => {
    const comment = await CommentService.getComment(req.params.id);
    return comment ? res.status(OK).send(comment) : res.sendStatus(NOT_FOUND);
})
