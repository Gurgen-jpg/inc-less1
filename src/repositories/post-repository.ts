import {PostUpdateModel} from "../models/posts/input";
import {postCollection} from "../db/db";
import {PostViewModel} from "../models/posts/output";
import {allPostsMapper} from "../models/posts/mappers/allPostsMapper";
import {ObjectId} from "mongodb";
import {PostDBModel} from "../models/db";

export class PostRepository {
    static async getAllPosts(): Promise<PostViewModel[] | null> {
        try {
            const posts = await postCollection.find({}).toArray();
            return posts.map(allPostsMapper);
        } catch (error) {
            console.error('Error in getAllPosts:', error);
            return null
        }
    }

    static async getPostById(id: string): Promise<PostViewModel | null> {
        try {
            const postId = ObjectId.createFromHexString(id);
            const post = await postCollection.findOne({_id: postId})
            if (post) {
                return allPostsMapper(post);
            } else {
                return null
            }
        } catch (error) {
            console.error('Error in getPostById:', error);
            return null
        }
    }

    static async addPost(post: PostDBModel): Promise<PostViewModel | null> {
        try {
            const postId = await postCollection.insertOne(post);
            return await this.getPostById(postId.insertedId.toString());
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
