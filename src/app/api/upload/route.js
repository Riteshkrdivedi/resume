import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(request) {
  try {
    // Log the incoming request
    console.log("Upload request received");

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      console.error("No file found in form data");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.includes("pdf")) {
      console.error("Invalid file type:", file.type);
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    console.log("File converted to buffer, size:", buffer.byteLength);

    try {
      const data = await pdfParse(buffer);
      console.log("PDF parsed successfully");

      if (!data.text || data.text.trim().length === 0) {
        console.error("No text extracted from PDF");
        return NextResponse.json(
          { error: "No text could be extracted from the PDF" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        text: data.text,
        numPages: data.numpages,
        info: data.info,
      });
    } catch (parseError) {
      console.error("PDF parsing error:", parseError);
      return NextResponse.json(
        { error: "Failed to parse PDF file" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: `Failed to process file: ${error.message}` },
      { status: 500 }
    );
  }
}
