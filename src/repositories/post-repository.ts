import {PostUpdateModel} from "../models/posts/input";
import {postCollection} from "../db/db";
import {InsertOneResult, ObjectId} from "mongodb";
import {PostDBModel} from "../models/db";

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
}
