import {PostUpdateModel} from "../models/posts/input";
import {commentsCollection, postCollection} from "../db/db";
import {InsertOneResult, ObjectId} from "mongodb";
import {CommentDBModel, PostDBModel} from "../models/db";;

export class PostRepository {

    static async addPost(post: PostDBModel): Promise<InsertOneResult<PostDBModel> | null> {
        try {
            return await postCollection.insertOne(post);
        } catch (e) {
            return null;
        }
    }

    static async updatePost(id: string, post: PostUpdateModel): Promise<boolean> {
        try {
            const result = await postCollection.updateOne({_id: ObjectId.createFromHexString(id)}, {
                $set: {
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content
                }
            })

            if (result.modifiedCount === 1) {
                return true;
            } else {
                console.warn('No document found for the provided id.');
                return false;
            }
        } catch (e) {
            console.log('Error in updatePost:', e);
            return false
        }
    }

    static async deletePost(id: string): Promise<boolean> {
        try {
            const result = await postCollection.deleteOne({_id: ObjectId.createFromHexString(id)})
            if (result.deletedCount === 1) {
                return true;
            } else {
                console.warn('No document found for the provided id.');
                return false;
            }
        } catch (e) {
            console.log('Error in deletePost:', e);
            return false
        }
    }

    static async createComment(postId: string, content: string, user: {_id: ObjectId, login: string}): Promise<ObjectId | undefined> {
        try {
            const newComment: CommentDBModel = {
                postId,
                content,
                commentatorInfo: {
                    userId: new ObjectId(user._id).toString(),
                    userLogin: user.login
                },
                createdAt: new Date().toISOString(),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: null
                },
                likes: []
            }
            const commentId = await commentsCollection.insertOne(newComment);

            if (!commentId.insertedId) {
               throw new Error('Can not create comment - error in repo');
            }
            return commentId.insertedId
        } catch (e) {
            console.error(e)
            return undefined
        }
    }

    static async isPostExist(id: string): Promise<boolean> {
        try {
            const post = await postCollection.findOne({_id: new ObjectId(id)})
            return !!post
        } catch (e) {
            console.error(e)
            return false
        }

    }
}
