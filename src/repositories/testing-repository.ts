import {
    blogCollection,
    commentsCollection,
    postCollection,
    sessionCollection,
    tokenCollection,
    usersCollection
} from "../db/db";

export class TestingRepository {
    static async deleteAllData() {
        try {
            await blogCollection.deleteMany({});
            await postCollection.deleteMany({});
            await usersCollection.deleteMany({});
            await commentsCollection.deleteMany({});
            await tokenCollection.deleteMany({});
            await sessionCollection.deleteMany({});

        } catch (e) {
            console.log('Error in deleteAllData:', e);
        }
    }
}
