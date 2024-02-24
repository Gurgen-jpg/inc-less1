import {CommentRepository} from "../repositories/comment-repository";
import {CommentInputModel} from "../models/comments/input";
import {CommentQueryRepository} from "../repositories/comment-query-repository";
import {UserViewModel} from "../models/users/output";

export class CommentService {
    static async deleteComment(id: string, user: Partial<UserViewModel>) {
        try {
            if (!user) throw new Error();
            const comment = await CommentRepository.getComment(id);
            if (!comment) return {
                statusCode: 404,
                message: "not found"
            };
            const isCommentCanBeDeleted = await CommentRepository.getUserCommentById(id, user.id!)
            if (!isCommentCanBeDeleted) return {
                statusCode: 403,
                message: "not found"
            };
            const isDeleted = await CommentRepository.deleteComment(id);
            if (isDeleted) return {
                statusCode: 204,
                message: "deleted"
            };
            return {
                statusCode: 403,
                message: "forbidden"
            };
        } catch (e) {
            return {
                statusCode: 404,
                message: "not found"
            };
        }
    }

    static async updateComment(id: string, newComment: string, user: Partial<UserViewModel>) {
        try {
            if (!id) return {
                statusCode: 404,
                message: "not found"
            };
            const comment = await CommentRepository.getComment(id);
            if (!comment) return {
                statusCode: 404,
                message: "not found"
            };
            if (user?.id !== comment.commentatorInfo.userId) return {
                statusCode: 403,
                message: "forbidden"
            };
            const isCommentCanBeDeleted = await CommentRepository.updateComment(id, newComment, user.id!);
            // await CommentRepository.getUserCommentById(id, user.id!)
            if (!isCommentCanBeDeleted) {
                return {
                    statusCode: 404,
                    message: "not found"
                }
            } else {
                return {
                    statusCode: 204,
                    message: "updated"
                }
            }

        } catch (e) {
            return {
                statusCode: 403,
                message: "not found"
            }
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
