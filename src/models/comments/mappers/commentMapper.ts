import {CommentDBModel} from "../../db";
import {ObjectId, WithId} from "mongodb";
import {CommentVewModel} from "../output";

export const commentMapper = (comment: WithId<CommentDBModel>): CommentVewModel => {
  return {
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
