import { JWTPayload } from "@/types/jwt.types"
import jwt from "jsonwebtoken"
// generateAccessToken()

// generateRefreshToken()

// verifyAccessToken()

// verifyRefreshToken()

export const generateAccessToken = (payload: JWTPayload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" })
}
export const generateRefreshToken = (payload: JWTPayload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" })
}

export const verifyAccessToken = (token: string): any => {
    try {
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)
        return decode
    } catch (error) {
        return false
    }
}
export const verifyRefreshToken = (token: string) => {
    try {
        const decode = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!)
        return decode
    } catch (error) {
        return false
    }
}

