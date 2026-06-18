import {UserRepositoryPostgresql} from "../repository/user/user-repository.postgre"
import { Register } from "../application/user/user-register-usecase"
import { Login } from "../application/user/user-login-usecase"
import { RegisterController } from "../controller/user/user-register-controller";
import { LoginController } from "../controller/user/user-login-controller";

//repository
const userRepo = new UserRepositoryPostgresql()

//register
const userRegisterUsecase = new Register(userRepo);
export const registerController = new RegisterController(userRegisterUsecase)

//login
const userLoginUsecase = new Login(userRepo)
export const loginController = new LoginController(userLoginUsecase)


