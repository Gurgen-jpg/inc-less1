import {LoginInputModel} from "../models/auth/input";

export class AuthService {
    static login(payload: LoginInputModel) {
        const {loginOrEmail, password} = payload;
        return {
            loginOrEmail,
            password
        }
    }
}
