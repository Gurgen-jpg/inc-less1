import {CommentRepository} from "../repositories/comment-repository";
import {CommentInputModel} from "../models/comments/input";
import {CommentQueryRepository} from "../repositories/comment-query-repository";
import {UserViewModel} from "../models/users/output";

export class CommentService {
    static async deleteComment(id: string, user: Partial<UserViewModel>) {
        try {
            if (!user) throw new Error();
            const isCommentCanBeDeleted = await CommentRepository.getUserCommentById(id, user.id!)
            if (!isCommentCanBeDeleted) return {
                statusCode: 403,
                message: "forbidden"
            };
            const isDeleted = await CommentRepository.deleteComment(id);
            if (isDeleted) return {
                statusCode: 204,
                message: "deleted"
            };
            return {
                statusCode: 404,
                message: "not found"
            };
        } catch (e) {
            return {
                statusCode: 404,
                message: "not found"
            };
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
