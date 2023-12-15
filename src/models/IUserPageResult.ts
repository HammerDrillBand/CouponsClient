import { ICategory } from "./ICategory";
import { IUser } from "./IUser";

export interface IUserPageResult {
    users: IUser[];
    totalPages: number;
}
