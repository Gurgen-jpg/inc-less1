import {CommentVewModel} from "../models/comments/output";
import {commentsCollection} from "../db/db";
import {ObjectId} from "mongodb";

export class CommentRepository {
    // static async getCommentById(id: string): Promise<CommentVewModel | null> {
    //     try {
    //         return await commentsCollection.findOne({_id: new ObjectId(id)});
    //     } catch (e) {
    //         return null
    //     }
    // }
}
