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
      retry: false
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
      retry: false
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
    <div className="flex h-screen">
      <div className="w-3/5 flex-grow space-y-2 text-sm">
        {res.data?.letter
          ?.split("\n\n")
          .map((p, i) => p.trim().length > 0 && <p key={i}>{p.trim()}</p>)}
        {res.isFetching && 
        <>
        <p className="h-4 w-1/3 animate-pulse rounded-md bg-gray-400"/>
        {Array.from({length: 15}, (_, i) => <p key={i} className="h-4 w-full animate-pulse rounded-md bg-gray-400"/>)}
        <p className="h-4 w-1/3 animate-pulse rounded-md bg-gray-400"/>
        <p className="h-4 w-1/3 animate-pulse rounded-md bg-gray-400"/>
        </>
        }
      </div>
      <div className="flex w-2/5 flex-col h-1/2">
        <label htmlFor="jobDetails" className="font-bold">Job Details</label>
        <textarea
          ref={jobDetailsRef}
          placeholder="Enter job details, or paste a link to the job posting"
        />
        <label htmlFor="applicantInfo" className="font-bold">Applicant Info</label>
        <textarea
          ref={applicantInfoRef}
          placeholder="Enter your resume info"
          className="flex-grow"
        />
        <button onClick={generateLetter} disabled={res.isFetching} className="font-bold">Generate Letter</button>
        {res.data?.letter && <button onClick={downloadPDF} className="font-bold">Download PDF</button>}
      </div>
    </div>
  );
}
