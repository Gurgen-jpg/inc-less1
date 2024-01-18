import dotenv from "dotenv";
import {MongoClient} from "mongodb";
import {BlogDBModel, PostDBModel} from "../models/db";

dotenv.config();
const PORT = 80;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

const client = new MongoClient(MONGODB_URI);

export const database = client.db('blogs-hws');

const blogCollection = database.collection<BlogDBModel>('blogs');
const postCollection = database.collection<PostDBModel>('posts');

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

export { connectDB, client, blogCollection, postCollection };
