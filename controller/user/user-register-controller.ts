import { Request, Response } from "express";
import { IUserRegisterUsecase } from "../../application/user/interface/user-register-usecase.interface";

export class RegisterController {
    constructor(private userUsecase : IUserRegisterUsecase){}

    register = async (req:Request , res:Response ) =>{
        const {username , email , phonenumber , password} = req.body

        const user = await this.userUsecase.register(username ,email , phonenumber , password)
        return res.status(201).json(user);
    }
}