"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";
import PDFViewerWidget from "../_components/widgets/pdf-widget";
import { CoverLetter } from "../../utils/pdf-generation";

import Editor, {
  Toolbar,
  makeNewDelta,
} from "../_components/rich-text/rich-text";
import Modal from "../_components/nav/modal";
import type ReactQuill from "react-quill";
import { type UnprivilegedEditor } from "react-quill";
import type { Delta } from "quill";

import { MdUploadFile } from "react-icons/md";
import Spinner from "../_components/spinner";
import toast from "react-hot-toast";

type UserInfo = RouterOutputs["userInfo"]["retrieveUserInfo"];

export default function GenerateLetter(props: { userInfo: UserInfo, userEmail: string, disableName?: boolean, headerId?: string }) {
  // Scrolling behavior
  const [headerHeight, setHeaderHeight] = useState(0);

  const headerSizeChanged = useCallback(() => {
    if (props.headerId) {
      const headerElement = document.getElementById(props.headerId);
      if (headerElement) {
        const { height } = headerElement.getBoundingClientRect();
        setHeaderHeight(height);
      }
    }
  }, [props.headerId]);

  useEffect(() => {
    window.addEventListener("resize", headerSizeChanged, false);
    headerSizeChanged();
  }, [headerSizeChanged]);

  // AI prompt state
  const [jobDetails, setJobDetails] = useState("");
  const [applicantInfo, setApplicantInfo] = useState("");
  const [generateIsOpen, setGenerateIsOpen] = useState(false);

  const [isParsingPDF, setIsParsingPDF] = useState(false);
  const [lastFile, setLastFile] = useState<string | undefined>(undefined);

  // Editor values
  const [focusedEditor, setFocusedEditor] = useState<"main" | "name" | "email" | "phone">("main");
  const [letterEditorValue, setLetterEditorValue] = useState<Delta | string | undefined>(undefined);
  const [nameEditorValue, setNameEditorValue] = useState<Delta | string | undefined>(undefined);
  const [emailEditorValue, setEmailEditorValue] = useState<Delta | string | undefined>(undefined);
  const [phoneEditorValue, setPhoneEditorValue] = useState<Delta | string | undefined>(undefined);

  const mainEditorRef = useRef<ReactQuill>(null);
  const focusName = useCallback(() => setFocusedEditor("name"), []);

  // Generate letter query
  const res = api.ai.generateLetter.useQuery(
    {
      jobDetails: jobDetails,
      applicantInfo: applicantInfo,
      dummy: false,
    },
    {
      enabled: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: false,
    }
  );

  // When the AI query is received, set the main editor
  useEffect(() => {
    if (res.data?.letter) {
      const delta = makeNewDelta(mainEditorRef.current)?.insert(
        res.data.letter,
      );
      setLetterEditorValue(delta);
    }
  }, [res.data]);

  // Callback functions
  const generateLetter = async () => {
    setGenerateIsOpen(false);
    await res.refetch();
  };

  const generateLetterModal = useCallback((editor?: UnprivilegedEditor) => {
    if (editor !== mainEditorRef.current?.getEditor()) {
      mainEditorRef.current?.focus();
      setGenerateIsOpen(true);
    }
  }, []);

  const handleResumeUpload = async (file: File | undefined) => {
    if (file) {
      const reader = new FileReader();
      // Read the file as an ArrayBuffer
      reader.onloadstart = () => {
        setIsParsingPDF(true);
        setLastFile("Parsing PDF...");
      };
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result;
        if (arrayBuffer instanceof ArrayBuffer) {
          const buffer = Buffer.from(arrayBuffer);
          const pdfToTextWorker = new Worker(new URL("~/utils/pdf-reading.ts", import.meta.url));
          pdfToTextWorker.onmessage = (event) => {
            console.log(event);
            if (typeof event.data === "string") {
              const textContent = event.data;
              setIsParsingPDF(false);
              setApplicantInfo(textContent);
              setLastFile(file.name);
            } else if ((event.data as { message: string, name: string }).message !== undefined) {
              toast.error((event.data as { message: string, name: string }).message);
              setIsParsingPDF(false);
              setLastFile(undefined);
            }
          };
          pdfToTextWorker.postMessage(buffer);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  // Defining some helpful variables
  const userName = [props.userInfo.personal?.firstname, props.userInfo.personal?.lastname].filter(Boolean).join(" ");
  const letter = useMemo(
    () => (<CoverLetter letterContents={letterEditorValue} name={props.disableName ? userName : nameEditorValue} email={emailEditorValue} phone={phoneEditorValue} />
    ), [emailEditorValue, letterEditorValue, nameEditorValue, phoneEditorValue, props.disableName, userName]);

  const deferredLetter = useDeferredValue(letter);  // Not sure if this is helping

  const emptyFields = jobDetails.length === 0 || applicantInfo.length === 0;

  // The full view
  return (
    <>
      <Modal
        isOpen={generateIsOpen}
        setIsOpen={setGenerateIsOpen}
        onClose={() => setGenerateIsOpen(false)}
        className="flex flex-col p-4 border rounded-lg space-y-5 shadow-xl w-full sm:w-fit min-w-[42%] sm:px-12 border-slate-400 bg-gradient-to-tl from-purple-50 to-blue-100"
      >
        <h1 className="my-3 text-3xl font-bold text-center text-slate-800">Generate with AI 🪄</h1>
        <div className="flex flex-col">
          <label htmlFor="jobDetails" className="font-bold text-slate-800">Job Details</label>
          <textarea
            name="jobDetails"
            placeholder="Enter job details, or paste a link to the job posting"
            className="h-12 placeholder-gray-500 bg-transparent outline-none resize-none text-slate-800"
            value={jobDetails.substring(0, 40000)}
            onChange={(e) => setJobDetails(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex w-full">
            <label htmlFor="applicantInfo" className="self-end font-bold text-slate-800">Applicant Info</label>
            <div className="flex-grow min-w-4" />
            <label className={`flex gap-1 text-2xl align-middle text-black ${!isParsingPDF ? "hover:text-slate-500 cursor-pointer" : ""}`}>
              <input type="file" className="hidden" accept=".pdf" onChange={(event) => handleResumeUpload(event.target.files?.[0])} disabled={isParsingPDF} />
              {isParsingPDF ? <Spinner /> : <MdUploadFile />}
              <p className="self-end overflow-hidden text-sm italic align-bottom max-w-80 whitespace-nowrap text-ellipsis" title={lastFile}>{lastFile ?? "Upload resume"}</p>
            </label>
          </div>
          <textarea
            name="applicantInfo"
            placeholder="Enter your resume info"
            className="flex-grow h-12 placeholder-gray-500 bg-transparent outline-none resize-none text-slate-800"
            value={applicantInfo.substring(0, 40000)}
            onChange={(e) => setApplicantInfo(e.target.value)}
            disabled={isParsingPDF}
          />
        </div>
        <button
          onClick={generateLetter}
          disabled={emptyFields || res.isFetching || isParsingPDF}
          className={
            `rounded-lg px-2 font-bold text-slate-800 outline-slate-800 duration-300 ease-in-out` +
            (!(emptyFields || res.isFetching)
              ? ` hover:bg-white hover:text-blue-500`
              : ``) +
            (!emptyFields ? ` outline` : ` outline outline-0`)
          }
        >
          Generate Letter
        </button>
      </Modal>
      <div className="z-10 flex flex-col w-screen p-2 px-8 space-y-2 border rounded-lg shadow-xl h-[60vh] border-slate-400 bg-gradient-to-r from-slate-50 sm:sticky sm:top-1/4 sm:float-end sm:w-5/12 sm:px-2">
        <PDFViewerWidget pdf={deferredLetter} downloadFilename="letter.pdf" />
      </div>
      <div
        className={`w-screen space-y-2 rounded-lg border border-slate-400 bg-white p-2 px-8 text-sm mb-8 sm:mt-8 sm:w-3/5 sm:p-4`}
      >
        <div className="m-auto flex min-h-[80vh] w-[99%] flex-col">
          <div className="mb-3 sticky bg-white z-30" style={{ top: `${(headerHeight - 0.1).toFixed(1)}px` }}>
            <Toolbar id="mainToolbar" showGenerateAI className={`relative left-0 top-0 ` + (focusedEditor === "main" ? `` : `hidden`)} />
            <Toolbar id="nameToolbar" showGenerateAI className={`relative left-0 top-0 ` + (focusedEditor === "name" ? `` : `hidden`)} />
            <Toolbar id="emailToolbar" showGenerateAI className={`relative left-0 top-0 ` + (focusedEditor === "email" ? `` : `hidden`)} />
            <Toolbar id="phoneToolbar" showGenerateAI className={`relative left-0 top-0 ` + (focusedEditor === "phone" ? `` : `hidden`)} />
          </div>
          <div className={res.isFetching ? "hidden" : ""}>
            <div className="flex">
              {(props.disableName !== true) && (<Editor
                toolbarId="nameToolbar"
                placeholder="Name"
                initial={userName}
                setValue={setNameEditorValue}
                singleLine
                onFocus={focusName}
                generateAIHandler={generateLetterModal}
                className="w-1/3 ql-compact"
              />)}
              <Editor
                toolbarId="emailToolbar"
                placeholder="Email"
                initial={props.userEmail}
                setValue={setEmailEditorValue}
                singleLine
                onFocus={useCallback(() => setFocusedEditor("email"), [])}
                generateAIHandler={generateLetterModal}
                className={`ql-compact ${props.disableName ? "w-1/2" : "w-1/3"}`}
              />
              <Editor
                toolbarId="phoneToolbar"
                placeholder="Phone number"
                initial={props.userInfo.personal?.phone ?? ""}
                setValue={setPhoneEditorValue}
                singleLine
                onFocus={useCallback(() => setFocusedEditor("phone"), [])}
                generateAIHandler={generateLetterModal}
                className={`ql-compact ${props.disableName ? "w-1/2" : "w-1/3"}`}
              />
            </div>
            <Editor
              toolbarId="mainToolbar"
              placeholder="Write your cover letter..."
              value={letterEditorValue}
              setValue={setLetterEditorValue}
              onFocus={useCallback(() => setFocusedEditor("main"), [])}
              generateAIHandler={generateLetterModal}
              editorRef={mainEditorRef}
              className="border border-b-0 border-t-black border-x-0"
            />
          </div>
          {res.isFetching && (
            <div className="mt-5 space-y-1">
              <p className="w-1/3 h-4 bg-gray-400 rounded-md animate-pulse" />
              {Array.from({ length: 15 }, (_, i) => (
                <p
                  key={i}
                  className="w-full h-4 bg-gray-400 rounded-md animate-pulse"
                />
              ))}
              <p className="w-1/3 h-4 bg-gray-400 rounded-md animate-pulse" />
              <p className="w-1/3 h-4 bg-gray-400 rounded-md animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
