import {blogCollection} from "../db/db";
import {blogMapper} from "../models/blogs/mappers/mapper";
import {ObjectId} from "mongodb";
import {BlogViewModel} from "../models/blogs/output";
import {BlogSortDataType, PaginationType} from "../models/common";

export class BlogQueryRepository {
    static async getAllBlogs(sortData: BlogSortDataType): Promise<PaginationType<BlogViewModel> | null> {
        const {sortBy, sortDirection, searchNameTerm, pageNumber, pageSize} = sortData;

        let filter = {};
        if (searchNameTerm) {
            filter = {
                name: {
                    $regex: searchNameTerm,
                    $options: 'i'
                }
            }
        }
        try {
            const totalCount = await blogCollection.countDocuments(filter);

            const pagesCount = Math.ceil(totalCount / pageSize);

            const blogs = await blogCollection
                .find(filter)
                .sort(sortBy, sortDirection)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray()
                .then(res => res.map(blogMapper));
            return blogs ? {pagesCount, totalCount, page: pageNumber, pageSize, items: blogs} : null;
        } catch (error) {
            console.log('Error in Repository getAllBlogs:',error);
            return null;
        }
    }

    static async getBlogById(id: string): Promise<BlogViewModel | null> {
        try {
            const blog = await blogCollection
                .findOne({_id: ObjectId.createFromHexString(id)})
            if (blog) {
                return blogMapper(blog);
            }
            return null;
        } catch (error) {
            console.error('Error in Repository getBlogById:', error);
            return null;
        }
    }
}
