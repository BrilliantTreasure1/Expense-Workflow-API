import { IUserRepository } from "../../repository/user/user-repository.interface";
import { IUserLoginUsecase, SafeUser } from "./interface/user-login-usecase.interface";
import bcrypt from "bcryptjs"


export class Login implements IUserLoginUsecase {
    constructor(private userRepo : IUserRepository) {}

    async login(email: string, password: string): Promise<SafeUser> {
         const user = await this.userRepo.findByEmail(email);
        
                
                if (!user) {
                    throw new Error("Invalid credentials")
                }
        
                const isMatch = await bcrypt.compare(password, user.getPassword());
        
                if (!isMatch) {
                    throw new Error("Invalid credentials");
                }
                
                return user.toJSON();
    }
}