import {blogCollection, postCollection, usersCollection} from "../db/db";

export class TestingRepository {
    static async deleteAllData() {
        try {
            await blogCollection.deleteMany({});
            await postCollection.deleteMany({});
            await usersCollection.deleteMany({});

        } catch (e) {
            console.log('Error in deleteAllData:', e);
        }
    }
}
