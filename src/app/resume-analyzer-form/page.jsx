"use client";

import React, { useState } from "react";

// import Navbar from "@/components/navbar";
// import Footer from "@/components/footer";
import Image from "next/image";
import { PiUploadBold } from "react-icons/pi";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    linkedinProfile: "",
    jobFitStatement: "",
    jobLocation: "",
    isAccepted: false,
    selectedFile: null,
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      selectedFile: file,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Basic validation
    if (!formData.isAccepted) {
      setSubmitError("Please accept the terms and conditions");
      return;
    }

    if (!formData.selectedFile) {
      setSubmitError("Please upload a resume file");
      return;
    }

    if (!formData.jobFitStatement) {
      setSubmitError("Please provide a job description");
      return;
    }

    try {
      setIsLoading(true);

      // First, upload the file
      const uploadFormData = new FormData();
      uploadFormData.append("file", formData.selectedFile);

      console.log("Uploading file:", formData.selectedFile.name);
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const uploadResult = await uploadResponse.json();
      console.log("Upload response:", uploadResult);

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || "File upload failed");
      }

      if (!uploadResult.success) {
        throw new Error("File upload was not successful");
      }

      if (!uploadResult.text) {
        throw new Error("No text could be extracted from the PDF");
      }

      // Then, analyze the resume
      const analyzeData = {
        resume_text: uploadResult.text,
        job_description: formData.jobFitStatement,
      };
      console.log("Sending analyze request with data:", {
        resume_text_length: analyzeData.resume_text.length,
        job_description_length: analyzeData.job_description.length,
      });

      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(analyzeData),
      });

      const analysisResult = await analyzeResponse.json();
      console.log("Analysis response:", analysisResult);

      if (!analyzeResponse.ok) {
        throw new Error(analysisResult.error || "Analysis failed");
      }

      // Store both results
      sessionStorage.setItem(
        "uploadResult",
        JSON.stringify({
          ...uploadResult,
          analysis: analysisResult,
          userData: {
            name: formData.fullName,
            email: formData.emailAddress,
          },
        })
      );

      window.location.href = "/processing";
    } catch (error) {
      console.error("Error:", error);
      setSubmitError(error.message || "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md">
            <p className="text-lg font-semibold">Processing...</p>
          </div>
        </div>
      )}

      {submitError && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{submitError}</p>
        </div>
      )}

      {/* <Navbar /> */}
      <form
        onSubmit={handleSubmit}
        className="h-fit p-6 md:p-20 flex flex-col gap-4 md:pt-[4vh] pt-[7vh]"
      >
        <div className="flex flex-col justify-evenly gap-4">
          <div className="flex gap-5">
            <Image
              src="/stars.jpg"
              alt="Resume Analyzer"
              width={100}
              height={100}
              className="border"
            />
            <div className="flex flex-col justify-evenly">
              <h1 className="text-3xl font-medium">Job Matches Keywords</h1>
              <p className="text-gray-600">Keywords Analysis</p>
            </div>
          </div>
          <hr className="h-1 bg-black" />
          <h1 className="text-xl font-medium">Resume Details</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-20">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName">
                <span className="text-red-500">*</span> Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="shadow border-2 rounded-md p-4 text-gray-700 leading-tight focus:outline-none h-10 hover:shadow-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="emailAddress">
                <span className="text-red-500">*</span> E-Mail Address
              </label>
              <input
                type="email"
                id="emailAddress"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                className="shadow border-2 rounded-md p-4 text-gray-700 leading-tight focus:outline-none h-10 hover:shadow-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phoneNumber">
                <span className="text-red-500">*</span> Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="shadow border-2 rounded-md p-4 text-gray-700 leading-tight focus:outline-none h-10 hover:shadow-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="linkedinProfile">LinkedIn Profile</label>
              <input
                type="url"
                id="linkedinProfile"
                name="linkedinProfile"
                value={formData.linkedinProfile}
                onChange={handleChange}
                placeholder="Enter your LinkedIn profile"
                className="shadow border-2 rounded-md p-4 text-gray-700 leading-tight focus:outline-none h-10 hover:shadow-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                Attachments (Resume, Cover Letter, Portfolio)
              </label>
              <label className="w-full h-20 flex flex-col items-center justify-center bg-cyan-400 text-white font-semibold rounded-md cursor-pointer hover:bg-cyan-500 transition-all">
                <h1 className="text-2xl">
                  <PiUploadBold />
                </h1>
                <h2>Drop Files Here</h2>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {formData.selectedFile && (
                <p className="mt-2 text-green-600">
                  Uploaded File:{" "}
                  <span className="font-semibold">
                    {formData.selectedFile.name}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="jobFitStatement">
                <span className="text-red-500">*</span> Job Description
              </label>
              <p>
                Responsibilities include developing applications, collaborating
                with teams, and ensuring code quality.
              </p>
              <textarea
                id="jobFitStatement"
                name="jobFitStatement"
                value={formData.jobFitStatement}
                onChange={handleChange}
                placeholder="Enter Job Description"
                required
                className="shadow border-2 rounded-md hover:shadow-md h-48 p-4 text-gray-700 leading-tight focus:outline-none"
              ></textarea>
            </div>
            <div>
              <label htmlFor="jobLocation">
                <span className="text-red-500">*</span> Are you Interested in
                receiving notifications for Job Openings?
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    id="jobLocationYes"
                    name="jobLocation"
                    value="Yes"
                    checked={formData.jobLocation === "Yes"}
                    onChange={handleChange}
                    required
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    id="jobLocationNo"
                    name="jobLocation"
                    value="No"
                    checked={formData.jobLocation === "No"}
                    onChange={handleChange}
                    required
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full md:w-[80vw] items-center mx-auto mt-4">
          <div className="mb-4 flex items-center">
            <button
              type="button"
              onClick={() =>
                handleChange({
                  target: {
                    name: "isAccepted",
                    type: "checkbox",
                    checked: !formData.isAccepted,
                  },
                })
              }
              className={`w-5 h-5 flex items-center justify-center rounded-md border-2 
                ${
                  formData.isAccepted
                    ? "bg-green-600 border-green-600 text-white"
                    : "border-gray-300 text-gray-700"
                } 
                font-semibold cursor-pointer`}
            >
              {formData.isAccepted ? "✓" : ""}
            </button>
            <label htmlFor="isAccepted" className="text-gray-700 text-xs ml-2">
              <span className="text-red-500">*</span> I Agree to Terms and
              Conditions
            </label>
            <input
              type="checkbox"
              id="isAccepted"
              name="isAccepted"
              checked={formData.isAccepted}
              onChange={handleChange}
              required
              className="hidden"
            />
          </div>

          <button
            type="submit"
            className="bg-orange-500 w-3/4 text-white font-semibold p-2 rounded-md hover:bg-orange-400 transition-all"
          >
            Submit
          </button>
        </div>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default Page;
