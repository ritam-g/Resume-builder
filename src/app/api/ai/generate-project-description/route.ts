import { main } from "@/lib/gemini";
import { GenerateProjectDescriptionBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/apiResponse.type";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body: GenerateProjectDescriptionBody = await req.json();

        const { projectTitle, jobTitle, techStack } = body;

        if (
            !projectTitle ||
            !jobTitle ||
            !techStack ||
            techStack.length === 0
        ) {
            const response: ApiResponse = {
                message: "All fields are required",
                success: false,
            };

            return Response.json(response, { status: 400 });
        }

        const prompt = `
You are an ATS resume expert.

Generate a professional resume project description.

Project Title: ${projectTitle}
Job Title: ${jobTitle}
Tech Stack: ${techStack.join(", ")}

Requirements:
- Write 4 bullet points.
- ATS friendly.
- Use strong action verbs.
- Highlight problem solving and impact.
- Mention the technologies naturally.
- Keep each bullet point concise and professional.
- Suitable for a resume.
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
            message: "Project description generated successfully",
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