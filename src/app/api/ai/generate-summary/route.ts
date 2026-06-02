import { main } from "@/lib/gemini";
import { GenerateSummeryBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/apiResponse.type";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest
) {
    try {
        const body: GenerateSummeryBody = await req.json();
        const { experenceLevel, skills, jobTitle } = body
        if (!experenceLevel || !skills || !jobTitle) {
            const response: ApiResponse = { message: "All fields are required", success: false }
            return Response.json(response, { status: 400 })
        }
        const prompt = `
You are an expert resume writer and ATS optimization specialist.

Generate a professional ATS-friendly resume summary based on the following details:

Job Title: ${jobTitle}
Experience Level: ${experenceLevel} years
Skills: ${skills}

Requirements:
- Write exactly 4-6 lines.
- Use professional language.
- Include the job title naturally.
- Include the provided skills naturally.
- Highlight key strengths, achievements, and expertise.
- Optimize for Applicant Tracking Systems (ATS).
- Do not use bullet points.
- Do not use first person words like "I", "me", or "my".
- Return only the resume summary text.
`;
        const result = await main(prompt) as string
        const summery = result.trim()

        const response: ApiResponse = { message: "Resume summary generated successfully", data: summery, success: true }
        return Response.json(response, { status: 201 })
    } catch (error) {
        console.log(error)
        const response: ApiResponse = { message: "Something went wrong", success: false }
        return Response.json(response, { status: 500 })
    }

}