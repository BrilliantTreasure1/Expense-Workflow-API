import { Request, Response } from "express";
import { IUserRegisterUsecase } from "../../application/user/interface/user-register-usecase.interface";

export class RegisterController {
    constructor(private userUsecase : IUserRegisterUsecase){}

    register = async (req:Request , res:Response ) =>{

        try {
            const {username , email , phonenumber , password} = req.body

            const user = await this.userUsecase.register(username ,email , phonenumber , password)
            res.status(201).json(user);

        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
}