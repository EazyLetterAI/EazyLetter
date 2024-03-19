"use client";

import { useState, useRef } from "react";
import { api } from "~/trpc/react";
import { saveAs } from "file-saver";

export default function GenerateLetter() {
  const jobDetailsRef = useRef<HTMLTextAreaElement>(null);
  const applicantInfoRef = useRef<HTMLTextAreaElement>(null);

  const [queryDetails, setQueryDetails] = useState({
    jobDetails: "",
    applicantInfo: "",
  });

  const [generatePdf, setGeneratePdf] = useState(false);

  const res = api.letter.generateLetter.useQuery(
    {
      jobDetails: queryDetails.jobDetails,
      applicantInfo: queryDetails.applicantInfo,
    },
    {
      enabled:
        queryDetails.jobDetails.length > 0 &&
        queryDetails.applicantInfo.length > 0,
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: false,
    },
  );

  const pdfRes = api.letter.generateLetterPdf.useQuery(
    {
      letterContents: res.data?.letter ?? "",
    },
    {
      enabled: generatePdf,
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: false,
    },
  );

  if (generatePdf && pdfRes.data) {
    const byteCharacters = atob(pdfRes.data.data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    saveAs(blob, "letter.pdf");
    setGeneratePdf(false);
  }

  const generateLetter = async () => {
    setQueryDetails({
      jobDetails: jobDetailsRef.current?.value ?? "",
      applicantInfo: applicantInfoRef.current?.value ?? "",
    });
  };

  const downloadPDF = async () => {
    setGeneratePdf(true);
  };

  return (
    <div className="h-screen">
      <div className="z-10 sm:float-end flex w-screen flex-col rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 p-2 px-8 shadow-xl sm:sticky sm:top-1/4 sm:w-5/12 sm:px-2">
        <h1 className="my-3 text-center text-3xl text-white">
          Generate a Cover Letter
        </h1>
        <label htmlFor="jobDetails" className="font-bold text-white">
          Job Details
        </label>
        <textarea
          ref={jobDetailsRef}
          placeholder="Enter job details, or paste a link to the job posting"
          className="bg-transparent text-white placeholder-slate-200 outline-none"
        />
        <label htmlFor="applicantInfo" className="font-bold text-white">
          Applicant Info
        </label>
        <textarea
          ref={applicantInfoRef}
          placeholder="Enter your resume info"
          className="flex-grow bg-transparent text-white placeholder-slate-200 outline-none"
        />
        <div className="flex justify-center space-x-5">
          <button
            onClick={generateLetter}
            disabled={res.isFetching}
            className="rounded-lg px-2 font-bold text-white outline outline-white duration-300 ease-in-out hover:bg-white hover:text-blue-500"
          >
            Generate Letter
          </button>
          {res.data?.letter && (
            <button
              onClick={downloadPDF}
              className="rounded-lg px-2 font-bold text-white outline outline-white duration-300 ease-in-out hover:bg-white hover:text-purple-500"
            >
              Download PDF
            </button>
          )}
        </div>
      </div>
      <div className="w-screen space-y-2 bg-white rounded-lg p-2 px-8 text-sm sm:w-3/5 sm:p-4 sm:mt-8">
        {res.data?.letter
          ?.split("\n\n")
          .map((p, i) => p.trim().length > 0 && <p key={i}>{p.trim()}</p>)}
        {res.isFetching && (
          <>
            <p className="h-4 w-1/3 animate-pulse rounded-md bg-gray-400" />
            {Array.from({ length: 15 }, (_, i) => (
              <p
                key={i}
                className="h-4 w-full animate-pulse rounded-md bg-gray-400"
              />
            ))}
            <p className="h-4 w-1/3 animate-pulse rounded-md bg-gray-400" />
            <p className="h-4 w-1/3 animate-pulse rounded-md bg-gray-400" />
          </>
        )}
      </div>
    </div>
  );
}
