import { main } from "@/lib/gemini";
import { ImproveContentBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/apiResponse.type";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body: ImproveContentBody = await req.json();

        const { content } = body;

        if (!content) {
            const response: ApiResponse = {
                message: "Content is required",
                success: false
            };

            return Response.json(response, { status: 400 });
        }

        const prompt = `
You are an expert ATS (Applicant Tracking System) resume reviewer.

Analyze the following resume content and provide an ATS score.

Resume Content:
${content}

Requirements:
- Give an ATS score between 0 and 100.
- Evaluate:
  - Keyword optimization
  - Professional language
  - Readability
  - ATS compatibility
  - Impact and achievements
- List strengths.
- List weaknesses.
- Give actionable suggestions for improvement.
- Be concise and professional.

Return ONLY valid JSON:

{
  "score": 85,
  "strengths": [
    "Strength 1",
    "Strength 2",
    "Strength 3"
  ],
  "weaknesses": [
    "Weakness 1",
    "Weakness 2"
  ],
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3"
  ]
}
`;

        const result = await main(prompt) as string;

        const parsed = JSON.parse(result);

        const response: ApiResponse = {
            message: "ATS score generated successfully",
            success: true,
            data: parsed
        };

        return Response.json(response, { status: 200 });

    } catch (error) {
        console.log(error);

        const response: ApiResponse = {
            message: "Something went wrong",
            success: false,
            error
        };

        return Response.json(response, { status: 500 });
    }
}