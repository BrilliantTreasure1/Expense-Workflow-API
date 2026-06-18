import {  Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { IUserLoginUsecase } from "../../application/user/interface/user-login-usecase.interface";



export class LoginController {
    constructor(private userUsecase : IUserLoginUsecase){}

     login = async (req:Request , res:Response) => {
            try {
                const {email , password} = req.body;
    
                if (!email || !password) {
                return res.status(400).json({
                error: "email and password are required"
                });
                }
    
                const user = await this.userUsecase.login(email , password)
    
    
                const secret = process.env.JWT_SECRET;

                if (!secret) {
                    return res.status(500).json({ error: "Server misconfigured" });
                }
    
                const token = Jwt.sign (
                    { userId: user.id },
                    secret,
                    { expiresIn: "1h" }
                );
    
                return res.status(200).json({
                    message: "login successful",
                    token,
                    user
                });
                
            } catch (error) {
            res.status(400).json({ error: (error as Error).message });
            }
        }
}