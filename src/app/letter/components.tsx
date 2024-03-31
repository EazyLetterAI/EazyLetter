"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import { saveAs } from "file-saver";
import Editor, { Toolbar } from "../_components/rich-text/rich-text";
import { CoverLetter } from "../_components/pdf";
import dynamic from "next/dynamic";
import type ReactQuill from "react-quill";
import { Quill, type UnprivilegedEditor } from "react-quill";
import type { Delta as DeltaType } from "quill";
import Modal from "../_components/modal";

const Delta = Quill.import("delta") as typeof DeltaType;
type Delta = DeltaType;

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

  const [focusedEditor, setFocusedEditor] = useState<
    "main" | "name" | "email" | "phone"
  >("main");
  const [letterEditorValue, setEditorValue] = useState(new Delta());
  const [nameEditorValue, setNameEditorValue] = useState(new Delta());
  const [emailEditorValue, setEmailEditorValue] = useState(new Delta());
  const [phoneEditorValue, setPhoneEditorValue] = useState(new Delta());

  const mainEditorRef = useRef<ReactQuill>(null);

  const [generateIsOpen, setGenerateIsOpen] = useState(false);

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
      letterContents: "",
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
      const delta = new Delta([{ insert: res.data.letter }]);
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
    setGenerateIsOpen(false);
    await res.refetch();
  };

  const downloadPDF = async () => {
    await pdfRes.refetch();
  };

  const generateLetterModal = useCallback((editor?: UnprivilegedEditor) => {
    if (editor !== mainEditorRef.current?.getEditor()) {
      mainEditorRef.current?.focus();
      setGenerateIsOpen(true);
    }
  }, []);

  const emptyFields = jobDetails.length === 0 || applicantInfo.length === 0;

  return (
    <div className="h-screen">
      <Modal
        isOpen={generateIsOpen}
        onClose={() => setGenerateIsOpen(false)}
        className="flex w-screen flex-col rounded-lg border border-slate-400 bg-gradient-to-r from-slate-50 to-blue-100 p-2 px-8 shadow-xl sm:w-5/12 sm:px-2"
      >
        <button className="absolute self-end" onClick={() => setGenerateIsOpen(false)}>x</button>
        <h1 className="my-3 text-center text-3xl text-slate-800">
          Generate with AI 🪄
        </h1>
        <label htmlFor="jobDetails" className="font-bold text-slate-800">
          Job Details
        </label>
        <textarea
          name="jobDetails"
          placeholder="Enter job details, or paste a link to the job posting"
          className="bg-transparent text-slate-800 placeholder-gray-500 outline-none"
          onChange={(e) => setJobDetails(e.target.value)}
        />
        <label htmlFor="applicantInfo" className="font-bold text-slate-800">
          Applicant Info
        </label>
        <textarea
          name="applicantInfo"
          placeholder="Enter your resume info"
          className="flex-grow bg-transparent text-slate-800 placeholder-gray-500 outline-none"
          onChange={(e) => setApplicantInfo(e.target.value)}
        />
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
      </Modal>
      <div className="z-10 flex w-screen h-3/5 flex-col rounded-lg border border-slate-400 bg-gradient-to-r from-slate-50 p-2 px-8 shadow-xl sm:sticky sm:top-1/4 sm:float-end sm:w-5/12 sm:px-2">
        <PDFViewer width={"100%"} className="flex-grow" showToolbar={false}>
          <CoverLetter letterContents={letterEditorValue}/>
        </PDFViewer>
        {letterEditorValue && (
          <button
            onClick={downloadPDF}
            className="rounded-lg px-2 font-bold text-slate-800 outline outline-slate-800 duration-300 ease-in-out hover:bg-white hover:text-blue-500"
          >
            Download PDF
          </button>
        )}
      </div>
      <div
        className={`w-screen space-y-2 rounded-lg border border-slate-400 bg-white p-2 px-8 text-sm sm:mt-8 sm:w-3/5 sm:p-4`}
      >
        <div className="m-auto flex min-h-[80vh] w-[99%] flex-col">
          <div className="relative">
            <Toolbar
              id="mainToolbar"
              className={
                `relative left-0 top-0 ` +
                (focusedEditor === "main" ? `` : `hidden`)
              }
            />
            <Toolbar
              id="nameToolbar"
              className={
                `relative left-0 top-0 ` +
                (focusedEditor === "name" ? `` : `hidden`)
              }
            />
            <Toolbar
              id="emailToolbar"
              className={
                `relative left-0 top-0 ` +
                (focusedEditor === "email" ? `` : `hidden`)
              }
            />
            <Toolbar
              id="phoneToolbar"
              className={
                `relative left-0 top-0 ` +
                (focusedEditor === "phone" ? `` : `hidden`)
              }
            />
          </div>
          <div className="flex">
            <Editor
              toolbarId="nameToolbar"
              placeholder="Name"
              value={nameEditorValue}
              setValue={setNameEditorValue}
              singleLine
              onFocus={useCallback(() => setFocusedEditor("name"), [])}
              generateAIHandler={generateLetterModal}
              className="ql-single-line w-1/3"
            />
            <Editor
              toolbarId="emailToolbar"
              placeholder="Email"
              value={emailEditorValue}
              setValue={setEmailEditorValue}
              singleLine
              onFocus={useCallback(() => setFocusedEditor("email"), [])}
              generateAIHandler={generateLetterModal}
              className="ql-single-line w-1/3"
            />
            <Editor
              toolbarId="phoneToolbar"
              placeholder="Phone number"
              value={phoneEditorValue}
              setValue={setPhoneEditorValue}
              singleLine
              onFocus={useCallback(() => setFocusedEditor("phone"), [])}
              generateAIHandler={generateLetterModal}
              className="ql-single-line w-1/3"
            />
          </div>
          <Editor
            toolbarId="mainToolbar"
            placeholder="Write your cover letter..."
            value={letterEditorValue}
            setValue={setEditorValue}
            onFocus={useCallback(() => setFocusedEditor("main"), [])}
            generateAIHandler={generateLetterModal}
            editorRef={mainEditorRef}
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
