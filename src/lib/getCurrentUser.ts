import { cookies } from "next/headers";
import { verifyAccessToken } from "./jwt";

export async function getCurrentUserId() {
    const cookie = await cookies()

    const token = cookie.get('accessToken')?.value
    if (!token) {
        throw new Error('No token found')
    }
    const decode = await verifyAccessToken(token)

    if(!decode){
        throw new Error("invalid creadential")
    }

    return decode.id
}