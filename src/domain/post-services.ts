import {PostInputModel, PostUpdateModel} from "../models/posts/input";
import {PostViewModel} from "../models/posts/output";
import {PostRepository} from "../repositories/post-repository";
import {BlogRepository} from "../repositories/blog-repository";
import {BlogQueryRepository} from "../repositories/blog-query-repository";
import {PostQueryRepository} from "../repositories/post-query-repository";
import {PostQueryRepoInputModel, PostSortDataType} from "../models/posts/postQueryRepoInputModel";
import {PaginationType} from "../models/common";


export class PostServices {
    static async getAllPosts(sortData: PostQueryRepoInputModel): Promise<PaginationType<PostViewModel> | null> {
        const payload = {
            sortBy: sortData.sortBy ?? 'createdAt',
            sortDirection: sortData.sortDirection ?? 'desc',
            pageNumber: sortData.pageNumber ? +sortData.pageNumber : 1,
            pageSize: sortData.pageSize ? +sortData.pageSize : 10,
            blogId: sortData.blogId
        }
        try {
            return await PostQueryRepository.getAllPosts(payload);
        } catch (error) {
            console.error('Error in getAllPosts:', error);
            return null
        }
    }

    static async getPostById(id: string): Promise<PostViewModel | null> {
        try {
            return await PostQueryRepository.getPostById(id);
        } catch (error) {
            console.error('Error in getPostById:', error);
            return null
        }
    }

    static async addPost(post: PostInputModel): Promise<PostViewModel | null> {
        try {
            const blog = await BlogQueryRepository.getBlogById(post.blogId)
            if (blog) {
                const newPost = {
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: blog.name,
                    createdAt: new Date().toISOString(),
                }
                const postId = await PostRepository.addPost(newPost);
                if (postId) {
                    return this.getPostById(postId.insertedId.toString())
                } else {
                    console.log('can not get recently added post with id: ', postId)
                    return null
                }
            } else {
                console.log('No blog found for the provided id.');
                return null
            }
        } catch (e) {
            console.log('Error in Service addPost:', e);
            return null;
        }
    }

    static async updatePost(id: string, post: PostUpdateModel): Promise<boolean> {
        try {
            return await PostRepository.updatePost(id, post)
        } catch (e) {
            console.log('Error in updatePost:', e);
            return false
        }
    }

    static async deletePost(id: string): Promise<boolean> {
        try {
            return await PostRepository.deletePost(id)
        } catch (e) {
            console.log('Error in deletePost:', e);
            return false
        }
    }
}