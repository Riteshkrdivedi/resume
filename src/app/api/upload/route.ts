import { NextResponse } from "next/server";
import extractTextFromFile from "../helpers/textExtractor";

export async function POST(request: Request) {
  console.log("ExtractTextFromFile Function:", extractTextFromFile);
  const formData = await request.formData();
  console.log("Form Data:", formData);
  const file = formData.get("file") as File;
  console.log("File:", file);
  console.log("File Name:", file.name);

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  if (file) {
    console.log("File Details:");
    console.log("Name:", file.name);
    console.log("Type:", file.type);
    console.log("Size:", file.size);
  }

  try {
    console.log("Extracting text from file:", file.name);
    const resumeText = await extractTextFromFile(file);

    return NextResponse.json({ resume_text: resumeText });
  } catch (error) {
    console.error("Error extracting text:", error);
    return NextResponse.json(
      { error: "Failed to extract text" },
      { status: 500 }
    );
  }
}
