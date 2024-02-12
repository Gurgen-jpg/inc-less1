import {CommentRepository} from "../repositories/comment-repository";
import {CommentInputModel} from "../models/comments/input";
import {CommentQueryRepository} from "../repositories/comment-query-repository";
import {UserViewModel} from "../models/users/output";
import {StatusCodeType} from "./status-code-service";

export class CommentService {
    static async deleteComment(id: string, user: Partial<UserViewModel>): Promise<StatusCodeType<null>> {
        try {
            if (!user || !user.id) {
                return {
                    statusCode: 401,
                    message: 'Unauthorized'
                }
            }
            const isCommentCanBeDeleted = await CommentRepository.getUserCommentById(id, user.id!)
            if (!isCommentCanBeDeleted) {
                return {
                    statusCode: 403,
                    message: 'Forbidden'
                }
            }
            const isDeleted = await CommentRepository.deleteComment(id);
            if (isDeleted) {
                return {
                    statusCode: 204,
                    message: 'No content'
                }
            }
            return {
                statusCode: 404,
                message: 'Not found'
            }
        } catch (e) {
            return {
                statusCode: 404,
                message: 'error in deleteComment'
            }
        }
    }

    static async updateComment(id: string, newComment: string, user: Partial<UserViewModel>): Promise<boolean> {
        try {
            if (!user || !user.id) return false;
            const isCommentCanBeDeleted = await CommentRepository.getUserCommentById(id, user.id!)
            if (!isCommentCanBeDeleted) return false;
            return await CommentRepository.updateComment(id, newComment);
        } catch (e) {
            return false
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
