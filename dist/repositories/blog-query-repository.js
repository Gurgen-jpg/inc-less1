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
exports.BlogQueryRepository = void 0;
const db_1 = require("../db/db");
const mapper_1 = require("../models/blogs/mappers/mapper");
const mongodb_1 = require("mongodb");
class BlogQueryRepository {
    static getAllBlogs(sortData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortBy, sortDirection, searchNameTerm, pageNumber, pageSize } = sortData;
            let filter = {};
            if (searchNameTerm) {
                filter = {
                    name: {
                        $regex: searchNameTerm,
                        $options: 'i'
                    }
                };
            }
            try {
                const totalCount = yield db_1.blogCollection.countDocuments(filter);
                const pagesCount = Math.ceil(totalCount / pageSize);
                const blogs = yield db_1.blogCollection
                    .find(filter)
                    .sort(sortBy, sortDirection)
                    .skip((pageNumber - 1) * pageSize)
                    .limit(pageSize)
                    .toArray()
                    .then(res => res.map(mapper_1.blogMapper));
                return blogs ? { pagesCount, totalCount, page: pageNumber, pageSize, items: blogs } : null;
            }
            catch (error) {
                console.log('Error in Repository getAllBlogs:', error);
                return null;
            }
        });
    }
    static getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield db_1.blogCollection
                    .findOne({ _id: mongodb_1.ObjectId.createFromHexString(id) });
                if (blog) {
                    return (0, mapper_1.blogMapper)(blog);
                }
                return null;
            }
            catch (error) {
                console.error('Error in Repository getBlogById:', error);
                return null;
            }
        });
    }
}
exports.BlogQueryRepository = BlogQueryRepository;
