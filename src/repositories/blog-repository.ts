import {db} from "../db/db";

export class BlogRepository {
    static getAllBlogs() {
        return db.blogs;
    }

    static getBlogById(id: string) {
        return db.blogs.find(blog => blog.id === +id);
    }

}
