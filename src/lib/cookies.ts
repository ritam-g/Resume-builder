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
        maxAge: 60 * 60 * 15
    })
}
export const setRefreshCookie = async (token: string) => {
    const cookie = await cookies()
    cookie.set("refreshToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7
    })
}
export const clearAuthCookies = async () => {
    const cookie = await cookies()
    cookie.delete("accessToken")
    cookie.delete("refreshToken")
}