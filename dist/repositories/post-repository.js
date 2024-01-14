"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const db_1 = require("../db/db");
class PostRepository {
    static getAllPosts() {
        return db_1.db.posts;
    }
    static getPostById(id) {
        return db_1.db.posts.find(post => post.id === id);
    }
    static addPost(post) {
        const newPost = Object.assign({ id: new Date().getTime().toString(), blogName: db_1.db.blogs.find(blog => blog.id === post.blogId).name }, post);
        db_1.db.posts.push(newPost);
        return newPost;
    }
    static updatePost(id, post) {
        const postToUpdate = db_1.db.posts.find(post => post.id === id);
        if (postToUpdate) {
            postToUpdate.title = post.title;
            postToUpdate.shortDescription = post.shortDescription;
            postToUpdate.content = post.content;
            postToUpdate.blogId = post.blogId;
        }
    }
    static deletePost(id) {
        db_1.db.posts = db_1.db.posts.filter(posts => posts.id !== id);
    }
}
exports.PostRepository = PostRepository;
