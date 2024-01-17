"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
class PostRepository {
    static getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return db.posts;
        });
    }
    static getPostById(id) {
        return db.posts.find(post => post.id === id);
    }
    static addPost(post) {
        const newPost = Object.assign({ id: new Date().getTime().toString(), blogName: db.blogs.find(blog => blog.id === post.blogId).name }, post);
        db.posts.push(newPost);
        return newPost;
    }
    static updatePost(id, post) {
        const postToUpdate = db.posts.find(post => post.id === id);
        if (postToUpdate) {
            postToUpdate.title = post.title;
            postToUpdate.shortDescription = post.shortDescription;
            postToUpdate.content = post.content;
            postToUpdate.blogId = post.blogId;
        }
    }
    static deletePost(id) {
        db.posts = db.posts.filter(posts => posts.id !== id);
    }
}
exports.PostRepository = PostRepository;
