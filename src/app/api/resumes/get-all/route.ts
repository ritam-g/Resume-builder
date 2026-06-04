import { getCurrentUserId } from "@/lib/getCurrentUser";
import { connectDB } from "@/lib/mongoose";
import resumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/apiResponse.type";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDB()
        const use_id =await getCurrentUserId()
        const resumes = await resumeModel.find({ user_id: use_id })

        const response: ApiResponse = { message: "resumes fetched successfully", data: resumes, success: true }
        return Response.json(response, { status: 200 })
    } catch (error) {
        console.log(error)
        const response: ApiResponse = { message: "Something went wrong", success: false }
        return Response.json(response, { status: 500 })
    }
}