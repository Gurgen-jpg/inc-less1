"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogMapper = void 0;
const blogMapper = (blogDb) => {
    return ({
        id: blogDb._id.toString(),
        name: blogDb.name,
        description: blogDb.description,
        websiteUrl: blogDb.websiteUrl,
        createdAt: blogDb.createdAt,
        isMembership: blogDb.isMembership
    });
};
exports.blogMapper = blogMapper;
