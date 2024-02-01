import {LoginInputModel} from "../models/auth/input";
import bcrypt from "bcrypt";
import {UserRepository} from "../repositories/users/user-repository";

export class AuthService {
    static async login(payload: LoginInputModel): Promise<boolean> {
        const {loginOrEmail, password} = payload;
        const isUserExist = await UserRepository.getUserByLoginOrEmail(loginOrEmail);
        if (!isUserExist) {
            return false
        } else{
            return await bcrypt.compare(password, isUserExist);
        }
    }
}
