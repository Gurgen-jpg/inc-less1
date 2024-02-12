import {CommentVewModel} from "../models/comments/output";
import {commentsCollection} from "../db/db";
import {ObjectId, WithId} from "mongodb";
import {CommentInputModel} from "../models/comments/input";
import {CommentDBModel} from "../models/db";
import {UserViewModel} from "../models/users/output";

export class CommentRepository {
    static async deleteComment(id: string): Promise<boolean> {
        try {

            const result = await commentsCollection.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (e) {
            console.log(e)
            return false
        }
    }

    static async updateComment(id: string, newComment: string, userid: string): Promise<boolean> {
        try {
            const result = await commentsCollection.updateOne({
                    _id: new ObjectId(id),
                    'commentatorInfo.userId': userid
                },
                {
                    $set: {
                        content: newComment
                    }
                });
            if (result.modifiedCount === 1) {
                return true
            }
            return false
        } catch (e) {
            console.log(e)
            return false
        }
    }

    static async getComment(id: string): Promise<WithId<CommentDBModel> | null> {
        try {
            return await commentsCollection.findOne({_id: new ObjectId(id)});
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    static async isCommentExist(id: string) {
        try {
            const result = await commentsCollection.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (e) {
            console.log(e)
            return false
        }
    }

    static async getUserCommentById(id: string, userId: string): Promise<WithId<CommentDBModel> | null> {
        try {
            const comment = await commentsCollection.findOne({
                _id: new ObjectId(id),
                'commentatorInfo.userId': userId
            });
            if (!comment) {
                return null
            }
            return comment
        } catch (e) {
            console.error('Error in getCommentById:', e);
            return null
        }

    }
}
