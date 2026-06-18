import { User } from "../../entities/user";
import { IUserRepository } from "../../repository/user/user-repository.interface";
import bcrypt from "bcryptjs"
import { IUserRegisterUsecase } from "./interface/user-register-usecase.interface";


export class Register implements IUserRegisterUsecase {
    constructor(private userRepo : IUserRepository){}

    async register(username: string, email: string, phonenumber: string, password: string):Promise<User> {

                const existing = await this.userRepo.findByEmail(email);
        
                if (existing) {
                    throw new Error("user registred before")
                }
        
                const hashPassword = await bcrypt.hash(password , 10);
        
                const user = User.create(null,username , email , phonenumber , hashPassword)
        
                const result = await this.userRepo.register(user)
        
                   if (!result) {
                    throw new Error("Failed to register user");
                }
                
                return result
            }
    }
