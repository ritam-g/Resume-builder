import { main } from "@/lib/gemini";
import {  ImproveContentBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/apiResponse.type";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest
) {
    try {
        const body: ImproveContentBody = await req.json();
        const { content } = body
        if (!content) {
            const response: ApiResponse = { message: "All fields are required", success: false }
            return Response.json(response, { status: 400 })
        }
        const prompt = `
You are an expert resume writer and ATS optimization specialist.

Improve the following resume content:

"${content}"

Requirements:
- Improve grammar, clarity, and professionalism.
- Make the content ATS friendly.
- Use strong action verbs where appropriate.
- Keep the original meaning and achievements.
- Make the content more impactful and concise.
- Use professional resume language.
- Remove unnecessary words and repetition.
- Do not add information that is not provided.
- Return only the improved content.
- No markdown.
- No explanations.

Improved Content:
`;
        const result = await main(prompt) as string;

        const improvedContent = result.trim();

        const response: ApiResponse = {
            message: "Content improved successfully",
            data: improvedContent,
            success: true
        };

        return Response.json(response, { status: 200 });
    } catch (error) {
        console.log(error)
        const response: ApiResponse = { message: "Something went wrong", success: false }
        return Response.json(response, { status: 500 })
    }

}