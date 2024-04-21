import {CommentDBModel} from "../../db";
import {ObjectId, WithId} from "mongodb";
import {CommentVewModel} from "../output";

export const commentMapper = (comment: WithId<CommentDBModel>, userId?: string): Omit<CommentVewModel, "likes"> => {
    return {
        likesInfo: {
            dislikesCount: comment.likesInfo.dislikesCount,
            likesCount: comment.likesInfo.likesCount,
            myStatus: userId
                ? comment.likes.find(like => like.authorId === userId)?.status ?? null
                : null
        },
        id: new ObjectId(comment._id).toString(),
        content: comment.content,
        // postId: new ObjectId(comment.postId).toString(),
        commentatorInfo: {
            userId: new ObjectId(comment.commentatorInfo.userId).toString(),
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt
    }
}
