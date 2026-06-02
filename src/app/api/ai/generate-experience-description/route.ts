import { main } from "@/lib/gemini";
import { GenerateExperienceDescriptionBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/apiResponse.type";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body: GenerateExperienceDescriptionBody = await req.json();

        const {
            company,
            position,
            startDate,
            endDate,
            skills
        } = body;

        if (
            !company ||
            !position ||
            !startDate ||
            !endDate ||
            !skills ||
            skills.length === 0
        ) {
            const response: ApiResponse = {
                message: "All fields are required",
                success: false,
            };

            return Response.json(response, { status: 400 });
        }

        const prompt = `
You are an ATS resume expert.

Generate professional work experience bullet points.

Company: ${company}
Position: ${position}
Duration: ${startDate} - ${endDate}
Skills Used: ${skills.join(", ")}

Requirements:
- Write exactly 4 bullet points.
- ATS friendly.
- Use strong action verbs.
- Focus on achievements and impact.
- Include measurable results whenever possible.
- Mention the provided skills naturally.
- Keep each bullet point concise and professional.
- Suitable for a modern resume.
- No markdown formatting.

Return ONLY valid JSON:

{
  "description": [
    "Bullet point 1",
    "Bullet point 2",
    "Bullet point 3",
    "Bullet point 4"
  ]
}
`;

        const result = await main(prompt) as string;

        const parsed = JSON.parse(result);

        const response: ApiResponse = {
            message: "Experience description generated successfully",
            data: parsed.description,
            success: true,
        };

        return Response.json(response, { status: 201 });

    } catch (error) {
        console.log(error);

        const response: ApiResponse = {
            message: "Something went wrong",
            success: false,
            error,
        };

        return Response.json(response, { status: 500 });
    }
}