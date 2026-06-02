import { main } from "@/lib/gemini";
import { GenerateSkillsBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/apiResponse.type";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest
) {
    try {
        const body: GenerateSkillsBody = await req.json();
        const { expreenceLevel, jobTitle } = body
        if (!expreenceLevel || !jobTitle) {
            const response: ApiResponse = { message: "All fields are required", success: false }
            return Response.json(response, { status: 400 })
        }
        const prompt = `
You are an ATS resume expert.

Generate 10-15 relevant technical and professional skills for the following candidate:

Job Title: ${jobTitle}
Experience Level: ${expreenceLevel} years

Requirements:
- Include both technical and soft skills.
- Skills must be relevant to the job title.
- ATS friendly.
- No explanations.
- No markdown.

Return ONLY valid JSON:

{
  "skills": [
    "Skill 1",
    "Skill 2",
    "Skill 3"
  ]
}
`;
        const result = await main(prompt) as string
        const skills = result.trim()
        const response: ApiResponse = { message: "Resume skills generated successfully", data: skills, success: true }
        return Response.json(response, { status: 201 })
    } catch (error) {
        console.log(error)
        const response: ApiResponse = { message: "Something went wrong", success: false }
        return Response.json(response, { status: 500 })
    }

}