"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { saveAs } from "file-saver";
import Editor from "../_components/rich-text";
import { CoverLetter } from "../_components/pdf";
import dynamic from "next/dynamic";
import { Delta } from "quill";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

export default function GenerateLetter() {
  const [jobDetails, setJobDetails] = useState("");
  const [applicantInfo, setApplicantInfo] = useState("");
  const [letterEditorValue, setEditorValue] = useState<Delta>();

  const res = api.ai.generateLetter.useQuery(
    {
      jobDetails: jobDetails,
      applicantInfo: applicantInfo,
      dummy: true,
    },
    {
      enabled: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: false,
    },
  );

  const pdfRes = api.pdf.generateLetterPdf.useQuery(
    {
      // letterContents: letterEditorValue,
      letterContents: ""
    },
    {
      enabled: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: false,
    },
  );

  useEffect(() => {
    if (res.data?.letter) {
      const delta = new Delta([{insert: res.data.letter}]);
      setEditorValue(delta);
    }
  }, [res.data]);

  useEffect(() => {
    if (pdfRes.data?.data) {
      const byteCharacters = atob(pdfRes.data?.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      saveAs(blob, "letter.pdf");
    }
  }, [pdfRes.data]);

  const generateLetter = async () => {
    await res.refetch();
  };

  const downloadPDF = async () => {
    await pdfRes.refetch();
  };

  const emptyFields = jobDetails.length === 0 || applicantInfo.length === 0;

  return (
    <div className="h-screen">
      <div className="z-10 flex w-screen flex-col rounded-lg border border-slate-400 bg-gradient-to-r from-slate-50 p-2 px-8 shadow-xl sm:sticky sm:top-1/4 sm:float-end sm:w-5/12 sm:px-2">
        <h1 className="my-3 text-center text-3xl text-slate-800">
          Generate a Cover Letter
        </h1>
        <label htmlFor="jobDetails" className="font-bold text-slate-800">
          Job Details
        </label>
        <textarea
          placeholder="Enter job details, or paste a link to the job posting"
          className="bg-transparent text-slate-800 placeholder-gray-500 outline-none"
          onChange={(e) => setJobDetails(e.target.value)}
        />
        <label htmlFor="applicantInfo" className="font-bold text-slate-800">
          Applicant Info
        </label>
        <textarea
          placeholder="Enter your resume info"
          className="flex-grow bg-transparent text-slate-800 placeholder-gray-500 outline-none"
          onChange={(e) => setApplicantInfo(e.target.value)}
        />
        <div className="flex justify-center space-x-5">
          <button
            onClick={generateLetter}
            disabled={emptyFields || res.isFetching}
            className={
              `rounded-lg px-2 font-bold text-slate-800 outline-slate-800 duration-300 ease-in-out` +
              (!(emptyFields || res.isFetching)
                ? ` hover:bg-white hover:text-blue-500`
                : ``) +
              (!emptyFields ? ` outline` : ``)
            }
          >
            Generate Letter
          </button>
          {letterEditorValue && (
            <button
              onClick={downloadPDF}
              className="rounded-lg px-2 font-bold text-slate-800 outline outline-slate-800 duration-300 ease-in-out hover:bg-white hover:text-blue-500"
            >
              Download PDF
            </button>
          )}
        </div>
        <PDFViewer>
          <CoverLetter letterContents={letterEditorValue} />
        </PDFViewer>
      </div>
      <div
        className={`w-screen space-y-2 rounded-lg border border-slate-400 bg-white p-2 px-8 text-sm sm:mt-8 sm:w-3/5 sm:p-4`}
      >
        <div className="m-auto block min-h-[80vh] w-[99%]">
          <Editor
            className="flex h-full flex-col"
            placeholder="Write your cover letter..."
            value={letterEditorValue}
            setValue={setEditorValue}
          />
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
    </div>
  );
}
