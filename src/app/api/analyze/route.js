// app/api/analyze/route.js
import { NextResponse } from "next/server";
import { calculateAtsAnalysis } from "../helpers/atsScorer";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Received analyze request with body:", body);

    const { resume_text, job_description } = body;

    if (!resume_text || !job_description) {
      console.log("Missing data:", { resume_text, job_description });
      return NextResponse.json(
        { error: "Missing resume text or job description" },
        { status: 400 }
      );
    }

    const analysis = calculateAtsAnalysis(resume_text, job_description);

    return NextResponse.json({
      message: "Analysis complete",
      ...analysis,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error.message || "Analysis failed" },
      { status: 500 }
    );
  }
}
