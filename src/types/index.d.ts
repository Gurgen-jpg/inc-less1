import {UserViewModel} from "../models/users/output";
import {SessionDBModel} from "../models/session/session";

declare global {
    declare namespace Express {
        export interface Request {
            context: {
                user: Partial<UserViewModel> | null;
                session: Partial<SessionDBModel> | null;
            }
        }
    }
}
