import { User } from "./user";

export class Post{
    title:string;
    content:string;
    createdOn: Date;
    author: User[];
}