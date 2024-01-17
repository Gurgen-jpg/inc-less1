import {WithId} from "mongodb";
import {BlogViewModel} from "../output";
import {BlogDBModel} from "../../db";

export const blogMapper = (blogDb: WithId<BlogDBModel>): BlogViewModel => {
    return ({
        id: blogDb._id.toString(),
        name: blogDb.name,
        description: blogDb.description,
        websiteUrl: blogDb.websiteUrl,
        createdAt: blogDb.createdAt,
        isMembership: blogDb.isMembership
    })
}
