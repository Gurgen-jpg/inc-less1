import {PostInputModel, PostUpdateModel} from "../models/posts/input";

export class PostRepository {
    static async getAllPosts(): Promise<PostInputModel[]> {
        return db.posts;
    }

    static getPostById(id: string) {
        return db.posts.find(post => post.id === id);
    }

    static addPost(post: PostInputModel) {
        const newPost = {
            id: new Date().getTime().toString(),
            blogName: db.blogs.find(blog => blog.id === post.blogId)!.name,
            ...post
        }
        db.posts.push(newPost);
        return newPost;
    }

    static updatePost(id: string, post: PostUpdateModel) {
        const postToUpdate = db.posts.find(post => post.id === id);
        if (postToUpdate) {
            postToUpdate.title = post.title;
            postToUpdate.shortDescription = post.shortDescription;
            postToUpdate.content = post.content;
            postToUpdate.blogId = post.blogId;
        }
    }

    static deletePost(id: string) {
        db.posts = db.posts.filter(posts => posts.id !== id);
    }
}
