import dotenv from "dotenv";
import {MongoClient} from "mongodb";
import {BlogDBModel, CommentDBModel, PostDBModel, TokenData, UserDBModel} from "../models/db";
import {SessionDBModel} from "../models/session/session";
import {RateLimitModel} from "../models/rateLimit/RateLimitModel";

dotenv.config();
const PORT = 80;

const MONGODB_URI = process.env.MONGODB_URI!;

const client = new MongoClient(MONGODB_URI);

export const database = client.db('blogs-hws');

const blogCollection = database.collection<BlogDBModel>('blogs');
const postCollection = database.collection<PostDBModel>('posts');
const usersCollection = database.collection<UserDBModel>('users');
const commentsCollection = database.collection<CommentDBModel>('comments');
const tokenCollection = database.collection<TokenData>('tokens-blacklist');
const sessionCollection = database.collection<SessionDBModel>('session');
const rateLimitCollection = database.collection<RateLimitModel>('rate-limit');
async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        console.log(`Here you go. ${PORT}`);

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        await client.close();
    }
}

export {
    connectDB,
    client,
    blogCollection,
    postCollection,
    usersCollection,
    commentsCollection,
    tokenCollection,
    sessionCollection,
    rateLimitCollection
};
