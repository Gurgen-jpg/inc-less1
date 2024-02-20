import bcrypt from "bcrypt";

export class BcryptService {
    protected static _saltRounds = 10;

    static async createHash(password: string): Promise<string | null> {
        try {
            return await bcrypt.hash(password, this._saltRounds);
        } catch (e) {
            console.error('Problem hashing password', e);
            return null;
        }
    }
}
