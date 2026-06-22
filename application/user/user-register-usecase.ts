import { User } from "../../entities/user";
import { IUserRepository } from "../../repository/user/user-repository.interface";
import bcrypt from "bcryptjs"
import { IUserRegisterUsecase } from "./interface/user-register-usecase.interface";
import { ConflictError, AppError } from "../../errors/app-error";


export class Register implements IUserRegisterUsecase {
    constructor(private userRepo : IUserRepository){}

    async register(username: string, email: string, phonenumber: string, password: string):Promise<User> {

                const existing = await this.userRepo.findByEmail(email);
        
                if (existing) {
                    throw new ConflictError("user registred before")
                }
        
                const hashPassword = await bcrypt.hash(password , 10);
        
                const user = User.create(null,username , email , phonenumber , hashPassword)
        
                const result = await this.userRepo.register(user)
        
                   if (!result) {
                    throw new AppError(500, "Failed to register user");
                }
                
                return result
            }
    }
