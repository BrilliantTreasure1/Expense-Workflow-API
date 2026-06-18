import { User } from "../../../entities/user";

export interface IUserRegisterUsecase {
    register(username:string , email:string , phonenumber:string , password:string ):Promise<User>;

}