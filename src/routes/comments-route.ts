import express, {Response} from "express";
import {tokenAuthorizationMiddleware} from "../middlewares/authValidation/token-authorization";
import {HTTP_STATUSES, Param, RequestBodyWithParamsType, RequestParamType} from "../models/common";
import {mongoIdValidation} from "../middlewares/inputValidation/input-validation-middleware";
import {CommentInputModel} from "../models/comments/input";
import {CommentRepository} from "../repositories/comment-repository";
import {CommentService} from "../domain/comment-service";
import {commentInputValidation} from "../validators/comment-validation";

export const commentsRoute = express.Router({});
const {OK, NO_CONTENT, NOT_FOUND} = HTTP_STATUSES;
commentsRoute.delete('/:id', mongoIdValidation, tokenAuthorizationMiddleware, async (req: RequestParamType<Param<'id'>>, res: Response) => {
    const isDeleted = await CommentService.deleteComment(req.params.id, req.context.user!);
    return isDeleted ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
})
commentsRoute.put('/:id', mongoIdValidation, tokenAuthorizationMiddleware, commentInputValidation(), async (req: RequestBodyWithParamsType<Param<'id'>, CommentInputModel>, res: Response) => {
    const isUpdate = await CommentService.updateComment(req.params.id, req.body.content, req.context.user!);
    return isUpdate ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
})
commentsRoute.get('/:id', mongoIdValidation, async (req: RequestBodyWithParamsType<Param<'id'>, CommentInputModel>, res: Response) => {
    const comment = await CommentService.getComment(req.params.id);
    return comment ? res.status(OK).send(comment) : res.sendStatus(NOT_FOUND);
})
