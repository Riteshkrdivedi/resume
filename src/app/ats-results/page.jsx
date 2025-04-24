"use client";

import React, { useState, useEffect } from "react";
import { buildStyles } from "react-circular-progressbar";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import * as Progress from "@radix-ui/react-progress";
import { useRouter } from "next/navigation";

const ResultsPage = () => {
  const router = useRouter();
  const [percentage, setPercentage] = useState(0);
  const [presentKeywords, setPresentKeywords] = useState([]);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [userData, setUserData] = useState({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadResults = () => {
      try {
        setIsLoading(true);
        const storedResults = sessionStorage.getItem("analysisResult");

        if (!storedResults) {
          throw new Error(
            "No analysis results found. Please submit your resume first."
          );
        }

        const results = JSON.parse(storedResults);

        // Set data from stored results
        setPercentage(results.score || 0);
        setPresentKeywords(results.analysis?.presentKeywords || []);
        setMissingKeywords(results.analysis?.missingKeywords || []);
        setSuggestions(results.recommendations || []);
        setUserData(results.userData || {});

        // Animate progress
        const timer = setInterval(() => {
          setProgress((prevProgress) => {
            if (prevProgress >= 100) {
              clearInterval(timer);
              return 100;
            }
            return prevProgress + 1;
          });
        }, 20);
      } catch (error) {
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();

    return () => {
      clearInterval(timer);
    };
  }, [router]);

  const handleDownload = () => {
    // Implement your download logic here
    console.log("Downloading updated resume...");
    // You might want to use the userData here
  };

  if (!userData.name) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8">Resume Analysis Results</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">ATS Score</h2>
          <div className="flex items-center gap-4">
            <div className="w-full">
              <Progress.Root
                className="relative overflow-hidden bg-gray-200 rounded-full w-full h-6"
                value={progress}
              >
                <Progress.Indicator
                  className="bg-blue-500 w-full h-full transition-all duration-300"
                  style={{ transform: `translateX(-${100 - progress}%)` }}
                />
              </Progress.Root>
            </div>
            <span className="text-2xl font-bold">{progress}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Present Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {presentKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Missing Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Suggestions</h2>
          <ul className="list-disc pl-5 space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-gray-700">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleDownload}
          className="text-white bg-black w-fit mx-auto font-semibold px-4 md:px-8 py-2 text-sm md:text-xl hover:bg-orange-500 hover:text-white transition-colors"
          disabled={isLoading || apiError}
        >
          {isLoading ? "Processing..." : "Download Updated Resume"}
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;
