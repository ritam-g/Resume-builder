import { cookies } from "next/headers"

// setAccessCookie()

// setRefreshCookie()

// clearAuthCookies()


export const setAccessCookie = async (token: string) => {
    const cookie = await cookies()
    cookie.set("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        //make it 15 minutes
        maxAge: 60 * 15
    })
}
export const setRefreshCookie = async (token: string) => {
    const cookie = await cookies()
    cookie.set("refreshToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        // make it 7 days
        maxAge: 60 * 60 * 24 * 7
    })
}
/**  
 * Clear auth cookies
 * @function clearAuthCookies
 * @returns {Promise<void>}
 * @description clear auth cookies accessToken and refreshToken
 */
export const clearAuthCookies = async () => {
    const cookie = await cookies()
    cookie.delete("accessToken")
    cookie.delete("refreshToken")
}