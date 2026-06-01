import { JWTPayload } from "@/types/user.types"
import jwt from "jsonwebtoken"

export const generateToken = (paylod: JWTPayload): string => {
    return jwt.sign(paylod, process.env.JWT_SECRET!, { expiresIn: "1h" })
}


export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET!)
}
