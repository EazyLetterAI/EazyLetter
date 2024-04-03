"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { api } from "~/trpc/react";
import Editor, {
  Toolbar,
  makeNewDelta,
} from "../_components/rich-text/rich-text";
import { CoverLetter } from "../_components/pdf-generation";
import Modal from "../_components/modal";
import type ReactQuill from "react-quill";
import { type UnprivilegedEditor } from "react-quill";
import type { Delta } from "quill";
import PDFViewerWidget from "../_components/pdf-widget";
import type { RouterOutputs } from "~/trpc/shared";

type UserInfo = RouterOutputs["userInfo"]["retrieveUserInfo"];

export default function GenerateLetter(props: { userInfo: UserInfo, userEmail: string, disableName?: boolean}) {
  const [jobDetails, setJobDetails] = useState("");
  const [applicantInfo, setApplicantInfo] = useState("");

  const [focusedEditor, setFocusedEditor] = useState<"main" | "name" | "email" | "phone">("main");
  const [letterEditorValue, setLetterEditorValue] = useState<Delta | string | undefined>(undefined);
  const [nameEditorValue, setNameEditorValue] = useState<Delta | string | undefined>(undefined);
  const [emailEditorValue, setEmailEditorValue] = useState<Delta | string | undefined>(undefined);
  const [phoneEditorValue, setPhoneEditorValue] = useState<Delta | string | undefined>(undefined);

  const mainEditorRef = useRef<ReactQuill>(null);
  const focusName = useCallback(() => setFocusedEditor("name"), []);

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

  useEffect(() => {
    if (res.data?.letter) {
      const delta = makeNewDelta(mainEditorRef.current)?.insert(
        res.data.letter,
      );
      setLetterEditorValue(delta);
    }
  }, [res.data]);

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

  const userName = [props.userInfo.personal?.firstname, props.userInfo.personal?.lastname].filter(Boolean).join(" ");
  const letter = useMemo(
    () => (<CoverLetter letterContents={letterEditorValue} name={props.disableName ? userName : nameEditorValue} email={emailEditorValue} phone={phoneEditorValue} />
    ), [emailEditorValue, letterEditorValue, nameEditorValue, phoneEditorValue, props.disableName, userName]);

  const deferredLetter = useDeferredValue(letter);

  const emptyFields = jobDetails.length === 0 || applicantInfo.length === 0;

  return (
    <div className="h-screen">
      <Modal
        isOpen={generateIsOpen}
        onClose={() => setGenerateIsOpen(false)}
        className="flex w-screen flex-col rounded-lg border border-slate-400 bg-gradient-to-tl from-purple-50 to-blue-100 p-4 px-8 shadow-xl sm:w-5/12 sm:px-8"
      >
        <button className="absolute self-end font-bold" onClick={() => setGenerateIsOpen(false)}>x</button>
        <h1 className="my-3 text-center text-3xl text-slate-800">Generate with AI 🪄</h1>
        <label htmlFor="jobDetails" className="font-bold text-slate-800">Job Details</label>
        <textarea
          name="jobDetails"
          placeholder="Enter job details, or paste a link to the job posting"
          className="bg-transparent text-slate-800 placeholder-gray-500 outline-none resize-none"
          onChange={(e) => setJobDetails(e.target.value)}
        />
        <label htmlFor="applicantInfo" className="font-bold text-slate-800">Applicant Info</label>
        <textarea
          name="applicantInfo"
          placeholder="Enter your resume info"
          className="flex-grow bg-transparent text-slate-800 placeholder-gray-500 outline-none resize-none"
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
      <div className="space-y-2 z-10 flex h-3/5 w-screen flex-col rounded-lg border border-slate-400 bg-gradient-to-r from-slate-50 p-2 px-8 shadow-xl sm:sticky sm:top-1/4 sm:float-end sm:w-5/12 sm:px-2">
        <PDFViewerWidget pdf={deferredLetter} downloadFilename="letter.pdf"/>
      </div>
      <div
        className={`w-screen space-y-2 rounded-lg border border-slate-400 bg-white p-2 px-8 text-sm sm:mt-8 sm:w-3/5 sm:p-4`}
      >
        <div className="m-auto flex min-h-[80vh] w-[99%] flex-col">
          <div className="relative mb-3">
            <Toolbar id="mainToolbar" className={`relative left-0 top-0 ` + (focusedEditor === "main" ? `` : `hidden`)} />
            <Toolbar id="nameToolbar" className={`relative left-0 top-0 ` + (focusedEditor === "name" ? `` : `hidden`)} />
            <Toolbar id="emailToolbar" className={`relative left-0 top-0 ` + (focusedEditor === "email" ? `` : `hidden`)} />
            <Toolbar id="phoneToolbar" className={`relative left-0 top-0 ` + (focusedEditor === "phone" ? `` : `hidden`)} />
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
                className="ql-single-line w-1/3"
              />)}
              <Editor
                toolbarId="emailToolbar"
                placeholder="Email"
                initial={props.userEmail}
                setValue={setEmailEditorValue}
                singleLine
                onFocus={useCallback(() => setFocusedEditor("email"), [])}
                generateAIHandler={generateLetterModal}
                className={`ql-single-line ${props.disableName ? "w-1/2" : "w-1/3"}`}
              />
              <Editor
                toolbarId="phoneToolbar"
                placeholder="Phone number"
                initial={props.userInfo.personal?.phone ?? ""}
                setValue={setPhoneEditorValue}
                singleLine
                onFocus={useCallback(() => setFocusedEditor("phone"), [])}
                generateAIHandler={generateLetterModal}
                className={`ql-single-line ${props.disableName ? "w-1/2" : "w-1/3"}`}
              />
            </div>
            <Editor
              toolbarId="mainToolbar"
              placeholder="Write your cover letter..."
              setValue={setLetterEditorValue}
              onFocus={useCallback(() => setFocusedEditor("main"), [])}
              generateAIHandler={generateLetterModal}
              editorRef={mainEditorRef}
              className="border border-t-black border-x-0 border-b-0"
            />
          </div>
          {res.isFetching && (
            <div className="space-y-1 mt-5">
              <p className="h-4 w-1/3 animate-pulse rounded-md bg-gray-400" />
              {Array.from({ length: 15 }, (_, i) => (
                <p
                  key={i}
                  className="h-4 w-full animate-pulse rounded-md bg-gray-400"
                />
              ))}
              <p className="h-4 w-1/3 animate-pulse rounded-md bg-gray-400" />
              <p className="h-4 w-1/3 animate-pulse rounded-md bg-gray-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
