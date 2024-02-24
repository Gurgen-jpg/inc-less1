import {ObjectId} from "mongodb";

export type UserViewModel = {
    id: string;
    login: string;
    email: string;
    createdAt?: string;
}

export type UserAuthViewModel = Omit<UserViewModel, 'createdAt'> & { password: string };

export type Users = UserViewModel[];
