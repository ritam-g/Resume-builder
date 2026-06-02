import { getCurrentUserId } from "@/lib/getCurrentUser";
import { connectDB } from "@/lib/mongoose";
import resumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/apiResponse.type";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const user_id = await getCurrentUserId()
        const newResume = await resumeModel.create({
            user_id,
            title: "My Resume",
            summery: "Resume summary",

            personalInfo: {
                fullname: "",
                email: "",
                mobile: 0,
                country: "",
                pincode: 0,
                location: ""
            },

            workExperience: [],
            education: [],
            certifications: [],
            projects: [],
            skills: [],
            acheivements: []
        });

        const respose: ApiResponse = {
            message: "resume created successfully",
            data: newResume,
            success: true
        }
        return Response.json(respose, { status: 201 })
    } catch (error) {
        console.log(error)
        const respose: ApiResponse = {
            message: "something went wrong",
            error,
            success: false
        }
        return Response.json(respose, { status: 500 })
    }
}