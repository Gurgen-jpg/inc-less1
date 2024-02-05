import {UserViewModel} from "../models/users/output";

declare global {
    declare namespace Express {
        export interface Request {
            context: {
                user: Partial<UserViewModel> | null;
            }
        }
    }
}
