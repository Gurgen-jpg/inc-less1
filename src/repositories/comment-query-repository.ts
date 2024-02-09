import {CommentVewModel} from "../models/comments/output";
import {commentsCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {commentMapper} from "../models/comments/mappers/commentMapper";
import {CommentsSortDataType, PaginationType} from "../models/common";

export class CommentQueryRepository {
    static async getCommentsByPostId(postId: string, sortData: CommentsSortDataType): Promise<PaginationType<CommentVewModel> | null> {
        debugger;
        try {
            console.log(postId)
            const totalCount = await commentsCollection.countDocuments({postId});

            const pagesCount = Math.ceil(totalCount / sortData.pageSize);
            const comments = await commentsCollection
                .find({})
                .sort({[sortData.sortBy]: sortData.sortDirection})
                .skip((sortData.pageNumber - 1) * sortData.pageSize)
                .limit(sortData.pageSize)
                .toArray();


            return {
                pagesCount,
                page: sortData.pageNumber,
                pageSize: totalCount,
                totalCount,
                items: comments.map(commentMapper)
            }

        } catch (e) {
            return null
        }
    }

    static async getCommentById(id: ObjectId): Promise<CommentVewModel | null> {
        try {
            const comment = await commentsCollection.findOne({_id: new ObjectId(id)});
            if (!comment) {
                return null
            }
            return commentMapper(comment)
        } catch (e) {
            console.error('Error in getCommentById:', e);
            return null
        }
    }
}
