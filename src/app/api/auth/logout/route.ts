import { getCurrentUser } from "@/app/helpers/getCurrentUser";
import { clearAuthCookies } from "@/lib/cookies";
import { ApiResponse } from "@/types/apiResponse.type";
import { NextRequest } from "next/server";
// Get Current User
//         ↓
// Remove refresh token from DB
//         ↓
// Clear cookies
//         ↓
// Return success
export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser()
        if (!user) {
            const response: ApiResponse = { message: "User not found", success: false }
            return Response.json(response, { status: 400 })
        }
        user.refreshToken = null
        await user.save()
        
        await clearAuthCookies()
        const response: ApiResponse = { message: "Logout successfully", success: true }
        return Response.json(response, { status: 200 })
    } catch (error) {
        console.log(error)
        const response: ApiResponse = { message: "Something went wrong", success: false }
        return Response.json(response, { status: 500 })
    }
}