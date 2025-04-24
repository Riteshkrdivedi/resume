"use client";

import React, { useState, useEffect } from "react";
import { buildStyles } from "react-circular-progressbar";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ResultsPage = () => {
  const [percentage, setPercentage] = useState(0);
  const [presentKeywords, setPresentKeywords] = useState([]);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [userData, setUserData] = useState({});

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
      } catch (error) {
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, []);

  const handleDownload = () => {
    // Implement your download logic here
    console.log("Downloading updated resume...");
    // You might want to use the userData here
  };

  return (
    <div>
      <div className="h-fit flex flex-col gap-5 pt-[10vh] md:pt-[15vh] pb-5">
        {/* User Info Section */}
        {userData.name && (
          <div className="w-[80vw] mx-auto p-4 bg-blue-50 rounded-md">
            <h2 className="font-medium text-xl">
              Analysis for: {userData.name}
            </h2>
            <p>Email: {userData.email}</p>
          </div>
        )}

        {/* ATS Score Section */}
        <div className="w-[80vw] hover:bg-gray-100 hover:shadow-lg transition-all h-[30vh] border-2 rounded-md mx-auto">
          <h1 className="font-medium text-2xl pl-6 pt-2">ATS Score</h1>
          <div className="h-[20vh] p-3 text-[8vh] hover:bg-white text-center border-2 rounded-md w-[20vh] mt-6 ml-10">
            {isLoading ? (
              <p>Loading...</p>
            ) : apiError ? (
              <p className="text-red-500 text-sm">{apiError}</p>
            ) : (
              <CircularProgressbar
                className="hover:scale-110 transition duration-500"
                value={percentage}
                text={`${percentage}%`}
                styles={buildStyles({
                  pathColor: "#F97316",
                  trailColor: "#ddd",
                  textColor: "#F97316",
                  pathTransitionDuration: 1.5,
                })}
              />
            )}
          </div>
        </div>

        {/* Keywords Section */}
        <div className="w-[80vw] hover:bg-gray-100 transition-all hover:shadow-lg h-fit md:gap-5 md:p-5 p-2 border-2 md:grid md:grid-cols-2 rounded-md mx-auto">
          {/* Present Keywords */}
          <div className="md:p-5 p-2">
            <h1 className="text-medium mb-2 md:mb-5 font-medium">
              Present keywords ({presentKeywords.length})
            </h1>
            <div className="rounded-md hover:scale-105 hover:bg-white transition duration-500 border p-2 md:p-5 text-green-500">
              {isLoading ? (
                <p>Loading...</p>
              ) : apiError ? (
                <p className="text-red-500">Error: {apiError}</p>
              ) : presentKeywords.length > 0 ? (
                <ul className="list-disc pl-5">
                  {presentKeywords.map((keyword, index) => (
                    <li key={index}>{keyword}</li>
                  ))}
                </ul>
              ) : (
                <p>No keywords found</p>
              )}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="md:p-5 p-2">
            <h1 className="text-medium mb-2 md:mb-5 font-medium">
              Missing keywords ({missingKeywords.length})
            </h1>
            <div className="rounded-md hover:scale-105 transition duration-500 hover:bg-white border p-2 md:p-5 text-red-500">
              {isLoading ? (
                <p>Loading...</p>
              ) : apiError ? (
                <p className="text-red-500">Error: {apiError}</p>
              ) : missingKeywords.length > 0 ? (
                <ul className="list-disc pl-5">
                  {missingKeywords.map((keyword, index) => (
                    <li key={index}>{keyword}</li>
                  ))}
                </ul>
              ) : (
                <p>All important keywords found!</p>
              )}
            </div>
          </div>
        </div>

        {/* Suggestions Section */}
        <div className="w-[80vw] hover:bg-gray-100 hover:shadow-lg transition-all h-fit border-2 rounded-md mx-auto">
          <h1 className="font-medium text-2xl pl-6 pt-2">
            Suggestions ({suggestions.length})
          </h1>
          <div className="h-[60%] p-2 border-2 hover:bg-white hover:scale-105 transition duration-500 rounded-md w-[85%] mt-6 mb-2 mx-auto">
            {isLoading ? (
              <p>Loading...</p>
            ) : apiError ? (
              <p className="text-red-500">Error: {apiError}</p>
            ) : suggestions.length > 0 ? (
              <ul className="list-disc pl-5">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="mb-2">
                    {suggestion}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No suggestions available</p>
            )}
          </div>
        </div>

        {/* Download Button */}
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
