import {usersCollection} from "../../db/db";
import {usersMapper} from "../../models/users/usersMapper";
import {UserViewModel} from "../../models/users/output";
import {Filter, ObjectId} from "mongodb";
import {PaginationType} from "../../models/common";
import {UserQueryModel} from "../../models/users/input";
import {UserDBModel} from "../../models/db";

// type Option = {
//     $regex: string | null;
//     $options: string;
// }
// type FilterType = {
//     login: Option | null;
//     email: Option | null;
// }


export class UserQueryRepository {
    static async getAllUsers(sortData: UserQueryModel): Promise<PaginationType<UserViewModel> | null> {
        let {
            sortBy,
            sortDirection,
            pageNumber,
            pageSize,
            searchLoginTerm,
            searchEmailTerm
        } = sortData;
        let filter: any = {};

        if (searchLoginTerm || searchEmailTerm) {
            filter = {
                $or: []
            };

            if (searchLoginTerm) {
                filter.$or.push({
                    login: {
                        $regex: searchLoginTerm,
                        $options: 'i'
                    }
                });
            }

            if (searchEmailTerm) {
                filter.$or.push({
                    email: {
                        $regex: searchEmailTerm,
                        $options: 'i'
                    }
                });
            }
        }



        console.log(filter);

        try {
            const totalCount = await usersCollection.countDocuments(filter);
            const pagesCount = Math.ceil(totalCount / pageSize);
            const users = await usersCollection
                .find(filter)
                .sort({[sortBy]: sortDirection})
                .limit(pageSize)
                .skip((pageNumber - 1) * pageSize)
                .toArray();
            return {
                pagesCount,
                page: pageNumber,
                pageSize,
                totalCount,
                items: users.map(usersMapper)
            };
        } catch (e) {
            console.log(e);
            return null
        }
    }

    static async getUserById(id: string): Promise<UserViewModel | null> {
        try {
            const user = await usersCollection.findOne({_id: new ObjectId(id)});
            if (!user) {
                return null
            }
            return usersMapper(user);
        } catch (e) {
            console.log(e);
            return null
        }
    }
}
