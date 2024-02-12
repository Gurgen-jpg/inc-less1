import {CommentRepository} from "../repositories/comment-repository";
import {CommentInputModel} from "../models/comments/input";
import {CommentQueryRepository} from "../repositories/comment-query-repository";
import {UserViewModel} from "../models/users/output";
import {statusCodeService, StatusCodeType} from "./status-code-service";

export class CommentService {
    static async deleteComment(id: string, user: Partial<UserViewModel>): Promise<StatusCodeType<null>> {
        try {
            if (!user || !user.id) return statusCodeService("NOT_FOUND", null);
            const isCommentCanBeDeleted = await CommentRepository.getUserCommentById(id, user.id!)
            if (!isCommentCanBeDeleted) return statusCodeService("FORBIDDEN", null);
            const isDeleted =  await CommentRepository.deleteComment(id);
            return isDeleted ? statusCodeService("NO_CONTENT", null) : statusCodeService("NOT_FOUND", null);
        } catch (e) {
            return statusCodeService("NOT_FOUND", null);
        }
    }

    static async updateComment(id: string, newComment: string, user: Partial<UserViewModel>): Promise<StatusCodeType<null>> {
        try {
            if (!user || !user.id) return statusCodeService("NOT_FOUND", null);
            const isCommentCanBeDeleted = await CommentRepository.getUserCommentById(id, user.id!)
            if (!isCommentCanBeDeleted) return statusCodeService("FORBIDDEN", null);
            const isUpdated = await CommentRepository.updateComment(id, newComment);
            return isUpdated ? statusCodeService("NO_CONTENT", null) : statusCodeService("NOT_FOUND", null);
        } catch (e) {
            return statusCodeService('NOT_FOUND', null);
        }
    }

    static async getComment(id: string) {
        try {
            return await CommentQueryRepository.getCommentById(id);
        } catch (e) {
            return null
        }
    }

}
