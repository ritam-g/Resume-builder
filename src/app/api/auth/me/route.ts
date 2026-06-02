import { getCurrentUser } from "@/app/helpers/getCurrentUser";
import { ApiResponse } from "@/types/apiResponse.type";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return Response.json({ message: "User not found" }, { status: 401 })
        }

        const response: ApiResponse = {
            message: "User found",
            data: user,
            success: true
        }

        return Response.json(response, {
            status: 200
        })
    } catch (error) {
        console.log(error)
        const response: ApiResponse = {
            message: "Something went wrong",
            error: error,
            success: false
        }

        return Response.json(response, {
            status: 500
        })
    }
}