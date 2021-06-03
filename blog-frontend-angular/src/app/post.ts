import { User } from "./user";

export class Post{
    title:string;
    content:string;
    createdAt: Date;
    author: User[];
}