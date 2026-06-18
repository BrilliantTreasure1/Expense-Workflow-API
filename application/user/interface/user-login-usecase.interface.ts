
export interface SafeUser {
  id: number | null;
  username: string;
  email: string;
  phonenumber: string;
}


export interface IUserLoginUsecase {
    login(email:string , password:string ):Promise<SafeUser>;
}