import {blogCollection, postCollection} from "../db/db";
import {BlogInputModel} from "../models/blogs/input";
import {ObjectId} from "mongodb";
import {BlogViewModel} from "../models/blogs/output";
import {BlogDBModel} from "../models/db";
import {BlogQueryRepository} from "./blog-query-repository";
export class BlogRepository {

    static async getBlogById(id: string): Promise<BlogDBModel | null> {
        try {
            const blog = await blogCollection
                .findOne({_id: ObjectId.createFromHexString(id)})
            if (blog) {
                return blog;
            }
            return null;
        } catch (error) {
            console.error('Error in Repository getBlogById:', error);
            return null;
        }
    }
    static async addBlog(blog: BlogDBModel): Promise<BlogViewModel | null> {
        try {
            const blogId = await blogCollection.insertOne(blog);
            return await BlogQueryRepository.getBlogById(blogId.insertedId.toString());
        } catch (e) {
            console.log('Error in Repository addBlog:', e);
            return null;
        }
    }

    static async updateBlog(id: string, blog: BlogInputModel): Promise<boolean> {
        const {name, description, websiteUrl} = blog;
        try {
            const blogId = ObjectId.createFromHexString(id);
            const result = await blogCollection.updateOne(
                { _id: blogId },
                {
                    $set: {
                        name,
                        description,
                        websiteUrl
                    }
                }
            );

            if (result.modifiedCount === 1) {
                return true;
            } else {
                console.warn('No document found for the provided id.');
                return false;
            }
        } catch (error) {
            console.error('Error in Repository  updating blog:', error);
            return false;
        }
    }

    static async deleteBlog(id: string): Promise<boolean> {
        try {
            const blogIsDeleted = await blogCollection.deleteOne({_id: ObjectId.createFromHexString(id)});
            await postCollection.deleteMany({blogId: id});
            return blogIsDeleted.deletedCount === 1;
        } catch (error) {
            console.error('Error in Repository  deleteBlogById:', error);
            return false;
        }
    }
}
