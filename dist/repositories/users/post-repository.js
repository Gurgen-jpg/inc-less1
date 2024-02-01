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
const db_1 = require("../../db/db");
const mongodb_1 = require("mongodb");
class PostRepository {
    static addPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_1.postCollection.insertOne(post);
            }
            catch (e) {
                return null;
            }
        });
    }
    static updatePost(id, post) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.postCollection.updateOne({ _id: mongodb_1.ObjectId.createFromHexString(id) }, {
                    $set: {
                        title: post.title,
                        shortDescription: post.shortDescription,
                        content: post.content
                    }
                });
                if (result.modifiedCount === 1) {
                    return true;
                }
                else {
                    console.warn('No document found for the provided id.');
                    return false;
                }
            }
            catch (e) {
                console.log('Error in updatePost:', e);
                return false;
            }
        });
    }
    static deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.postCollection.deleteOne({ _id: mongodb_1.ObjectId.createFromHexString(id) });
                if (result.deletedCount === 1) {
                    return true;
                }
                else {
                    console.warn('No document found for the provided id.');
                    return false;
                }
            }
            catch (e) {
                console.log('Error in deletePost:', e);
                return false;
            }
        });
    }
}
exports.PostRepository = PostRepository;
