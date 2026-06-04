import { main } from "@/lib/gemini";
import { ATSScoreBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/apiResponse.type";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: ATSScoreBody = await req.json();


    const { resumeText } = body;

    if (!resumeText) {
      const response: ApiResponse = {
        message: "Resume text is required",
        success: false,
      };

      return Response.json(response, { status: 400 });
    }

    const prompt = `
      

You are a professional ATS (Applicant Tracking System) resume reviewer.

Analyze the following resume and provide a detailed ATS evaluation.

Resume:
${resumeText}

Evaluation Criteria:

1. ATS Compatibility
2. Keyword Optimization
3. Professional Summary
4. Skills Section
5. Work Experience
6. Projects
7. Education
8. Achievements & Impact
9. Formatting & Readability

Instructions:

* Assign an overall ATS score between 0 and 100.
* Provide 3-5 strengths.
* Provide 3-5 weaknesses.
* Provide 5 actionable suggestions to improve the ATS score.
* Be objective and professional.
* Focus on resume quality and ATS optimization.
* Return ONLY valid JSON.
* Do not include markdown.

Return JSON in this exact format:

{
"score": 85,
"strengths": [
"Strength 1",
"Strength 2",
"Strength 3"
],
"weaknesses": [
"Weakness 1",
"Weakness 2",
"Weakness 3"
],
"suggestions": [
"Suggestion 1",
"Suggestion 2",
"Suggestion 3",
"Suggestion 4",
"Suggestion 5"
]
}
`;


    const result = await main(prompt) as string;

    const atsReport = JSON.parse(result);

    const response: ApiResponse = {
      message: "ATS score generated successfully",
      success: true,
      data: atsReport,
    };

    return Response.json(response, { status: 200 });

  } catch (error) {
    console.log(error);

    const response: ApiResponse = {
      message: "Failed to generate ATS score",
      success: false,
      error,
    };

    return Response.json(response, { status: 500 });
  }


}

