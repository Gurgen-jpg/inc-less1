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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCollection = exports.blogCollection = exports.client = exports.connectDB = exports.database = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
const PORT = 80;
const MONGODB_URI = process.env.MONGO_URL_ATLAS || 'mongodb://localhost:27017';
const client = new mongodb_1.MongoClient(MONGODB_URI);
exports.client = client;
exports.database = client.db('blogs-hws');
const blogCollection = exports.database.collection('blogs');
exports.blogCollection = blogCollection;
const postCollection = exports.database.collection('posts');
exports.postCollection = postCollection;
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log('Connected to MongoDB');
            console.log(`Here you go. ${PORT}`);
        }
        catch (error) {
            console.error('Error connecting to MongoDB:', error);
            yield client.close();
        }
    });
}
exports.connectDB = connectDB;
