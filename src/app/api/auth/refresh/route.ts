import { rotateToken } from "@/app/helpers/getCurrentUser";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/jwt";
import { ApiResponse } from "@/types/apiResponse.type";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
// Read refresh token cookie
//         ↓
// No refresh token ?
//         ↓
// 401


export async function GET(req: NextRequest) {
    try {
        const cookie = await cookies()
        const isRefreshToken = cookie.get('refreshToken')
        if(!isRefreshToken){
            return Response.json({message:"Unauthorized"},{status:401})
        }
        const user = await rotateToken()
        if(!user){
            return Response.json({message:"Unauthorized"},{status:401})
        }

        const response: ApiResponse = { message: "Refresh token successfully", success: true, data: user }
        return Response.json(response, { status: 200 })
    } catch (error) {
        const response: ApiResponse = { message: "Something went wrong", success: false, error: error }

        return Response.json(response, { status: 500 })

    }
}