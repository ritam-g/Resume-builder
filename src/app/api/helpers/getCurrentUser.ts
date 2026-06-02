import { verifyAccessToken } from "@/lib/jwt";
import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getCurrentUser() {
    try {
        const cookie = await cookies()
        const token = cookie.get('accessToken')
        if (!token) {
            throw new Error('No token found')
        }

        const decode = await verifyAccessToken(token.value)

        if (!decode || typeof decode === 'string') {
            throw new Error('Invalid token')
        }
        return decode.id
    } catch (error) {
        console.log(error)

    }
}