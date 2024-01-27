import {PostUpdateModel} from "../models/posts/input";
import {postCollection} from "../db/db";
import {PostViewModel} from "../models/posts/output";
import {allPostsMapper} from "../models/posts/mappers/allPostsMapper";
import {ObjectId} from "mongodb";
import {PostDBModel} from "../models/db";
import {PaginationType} from "../models/common";
import {PostSortDataType} from "../models/posts/postQueryRepoInputModel";

export class PostQueryRepository {
    static async getAllPosts(sortData: PostSortDataType): Promise<PaginationType<PostViewModel> | null> {
        const {pageSize, pageNumber, sortBy, sortDirection, blogId} = sortData;

        const filter = blogId ? {blogId} : {};

        try {
            const totalCount = await postCollection.countDocuments(filter);
            const pagesCount = Math.ceil(totalCount / pageSize);
            const posts = await postCollection
                .find(filter)
                .sort(sortBy, sortDirection)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray();
            return {
                pageSize,
                page: pageNumber,
                pagesCount,
                totalCount,
                items: posts.map(allPostsMapper)
            };
        } catch (error) {
            console.error('Error in getAllPosts:', error);
            return null
        }
    }

    // static async getAllPostsByBlogId(blogId: string): Promise<PaginationType<PostViewModel> | null> {
    //     try {
    //         const postId = ObjectId.createFromHexString(blogId);
    //         const posts = await postCollection
    //             .find({_id: postId})
    //             .toArray();
    //         return {
    //             pagesCount: 1,
    //             page: 1,
    //             pageSize: posts.length,
    //             totalCount: posts.length,
    //             items: posts.map(allPostsMapper)
    //         }
    //     } catch (error) {
    //         console.error('Error in getAllPostsByBlogId:', error);
    //         return null
    //     }
    // }

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


}
