import {CommentVewModel} from "../models/comments/output";
import {commentsCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {commentMapper} from "../models/comments/mappers/commentMapper";
import {CommentsSortDataType, PaginationType} from "../models/common";

export class CommentQueryRepository {
    static async getCommentsByPostId(postId: string, sortData: CommentsSortDataType, userId?: string): Promise<PaginationType<Omit<CommentVewModel, "likes">> | null> {
        try {
            const totalCount = await commentsCollection.countDocuments({postId});
            const pagesCount = Math.ceil(totalCount / sortData.pageSize);
            const comments = await commentsCollection
                .find({postId})
                .sort({[sortData.sortBy]: sortData.sortDirection})
                .skip((sortData.pageNumber - 1) * sortData.pageSize)
                .limit(sortData.pageSize)
                .toArray();

            return {
                pagesCount,
                page: sortData.pageNumber,
                pageSize: sortData.pageSize,
                totalCount,
                items: comments.map((comment) => commentMapper(comment, userId))
            }

        } catch (e) {
            return null
        }
    }

    static async getCommentById(id: ObjectId | string, userId?: string): Promise<CommentVewModel | null> {
        try {
            const comment = await commentsCollection.findOne({_id: new ObjectId(id)});
            if (!comment) {
                return null
            }
            return commentMapper(comment, userId)
        } catch (e) {
            console.error('Error in getCommentById:', e);
            return null
        }
    }
}
