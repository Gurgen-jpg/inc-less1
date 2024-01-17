import {blogCollection, postCollection} from "../db/db";

export class TestingRepository {
    static async deleteAllData() {
        try {
            await blogCollection.deleteMany({});
            await postCollection.deleteMany({});

        } catch (e) {
            console.log('Error in deleteAllData:', e);
        }
    }
}
