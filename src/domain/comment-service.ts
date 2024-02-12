import {CommentRepository} from "../repositories/comment-repository";
import {CommentInputModel} from "../models/comments/input";
import {CommentQueryRepository} from "../repositories/comment-query-repository";
import {UserViewModel} from "../models/users/output";

export class CommentService {
    static async deleteComment(id: string, user: Partial<UserViewModel>): Promise<boolean> {
        try {
            if (!user || !user.id) return false;
            const isCommentCanBeDeleted = await CommentRepository.getUserCommentById(id, user.id!)
            if (!isCommentCanBeDeleted) return false;
            return await CommentRepository.deleteComment(id);
        } catch (e) {
            return false
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
