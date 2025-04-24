// app/processing/page.jsx
"use client";

import { useEffect } from "react";

export default function ProcessingPage() {
  useEffect(() => {
    // Check if we have upload results
    const storedData = sessionStorage.getItem("uploadResult");

    if (!storedData) {
      window.location.href = "/";
      return;
    }

    // Process the data (you might call another API here)
    const processData = async () => {
      try {
        const uploadResult = JSON.parse(storedData);

        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileData: uploadResult,
            jobDescription: uploadResult.jobDescription,
          }),
        });

        if (!response.ok) throw new Error("Analysis failed");

        const analysisResult = await response.json();

        // Store final results and redirect
        sessionStorage.setItem(
          "analysisResult",
          JSON.stringify(analysisResult)
        );
        window.location.href = "/results";
      } catch (error) {
        console.error("Processing error:", error);
        sessionStorage.setItem("processingError", error.message);
        window.location.href = "/error";
      }
    };

    processData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500 mb-4"></div>
      <h1 className="text-2xl font-semibold">Processing Your Resume...</h1>
      <p className="text-gray-600 mt-2">This may take a few moments</p>
    </div>
  );
}
