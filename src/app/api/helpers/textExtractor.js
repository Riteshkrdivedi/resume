import pdfParse from "pdf-parse";

export default async function extractTextFromFile(file) {
  console.log("Extracting text from file----:", file);
  try {
    // Convert the file to a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Parse the PDF
    const data = await pdfParse(buffer);

    // Return the extracted text
    return data.text;
  } catch (error) {
    console.error("Error parsing PDF:", error);

    // Throw a new error to ensure the original error context is preserved
    throw new Error("Failed to extract text from the uploaded file");
  }
}
