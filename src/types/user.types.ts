//! interface will be for user
export interface IUser {
    name: string;
    email: string;
    password: string;
    _id: string
    modbile: string
    createdAt?: Date // ? = optional
    updatedAt?: Date
}

export interface RegisterBody{
    name:string
    email:string
    password:string
    modbile:string
}

interface LoginBody{
    email:string
    password:string
}

 export interface JWTPayload{
    userId:string
    email?:string
}