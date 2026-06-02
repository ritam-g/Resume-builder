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


export async function GET() {
    try {
        const cookieStore = await cookies();

        const refreshToken = cookieStore.get("refreshToken");

        if (!refreshToken) {
            const response: ApiResponse = {
                success: false,
                message: "Unauthorized",
            };

            return Response.json(response, { status: 401 });
        }

        const user = await rotateToken();

        if (!user) {
            const response: ApiResponse = {
                success: false,
                message: "Unauthorized",
            };

            return Response.json(response, { status: 401 });
        }

        const response: ApiResponse = {
            success: true,
            message: "Token refreshed successfully",
            data: user,
        };

        return Response.json(response, { status: 200 });

    } catch (error) {
        const response: ApiResponse = {
            success: false,
            message: "Something went wrong",
            error,
        };

        return Response.json(response, { status: 500 });
    }
}