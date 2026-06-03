import { getCurrentUserId } from "@/lib/getCurrentUser";
import { connectDB } from "@/lib/mongoose";
import resumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/apiResponse.type";
import { NextRequest } from "next/server";

export  async function POST(req: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
    try {
        await connectDB()

        const suer = await getCurrentUserId()

        const { resumeId } = await params

        const resume = await resumeModel.findOne({ _id: resumeId, user_id: suer })

        if(!resume) {
            const response: ApiResponse = { message: "Resume not found", success: false }
            return Response.json(response, { status: 404 })
        }

        const response: ApiResponse = { message: "resume fetched successfully", data: resume, success: true }
        return Response.json(response, { status: 200 })
    } catch (error) {
        console.log(error)
        const response: ApiResponse = { message: "Something went wrong", success: false }
        return Response.json(response, { status: 500 })
    }
}
/**  
 * @route PATCH /api/resumes/[resume]
 * @desc Update a resume
 */
export  async function PATCH(req: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {}

