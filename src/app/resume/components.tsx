"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { RouterOutputs } from "~/trpc/shared";
import PDFViewerWidget from "../_components/widgets/pdf-widget";
import { Resume, type ResumeInfo } from "../../utils/pdf-generation";

import Editor, {
  Toolbar,
} from "../_components/rich-text/rich-text";
import type { Delta } from "quill";

import { DragDropContext, Droppable, Draggable, type DropResult, type DroppableProps } from "react-beautiful-dnd";

export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
};

import { MdAdd, MdRemove, MdDragIndicator } from "react-icons/md";

type UserInfo = RouterOutputs["userInfo"]["retrieveUserInfo"];

const formatDate = (date?: Date | null) => date?.toLocaleDateString("en-US", { year: "numeric", month: "long" });

function initializeResumeInfo(userInfo: UserInfo, userEmail: string): ResumeInfo {
  return {
    name: [userInfo.personal?.firstname, userInfo.personal?.lastname].filter(Boolean).join(" "),
    email: userEmail,
    phone: userInfo.personal?.phone,
    address: userInfo.personal?.address,
    experiences: userInfo.experiences.map((exp) => ({
      title: exp.title,
      type: exp.type,
      location: exp.location,
      startDate: formatDate(exp.startDate)!,
      endDate: formatDate(exp.endDate),
      link: exp.link,
      description: exp.description,
    })),
    education: userInfo.education.map((edu) => ({
      schoolName: edu.schoolName,
      location: edu.location,
      startDate: formatDate(edu.startDate)!,
      endDate: formatDate(edu.endDate),
      gpa: edu.gpa,
      description: "",
    })),
    links: userInfo.links.map((link) => ({
      display: link.type,
      link: link.link,
    })),
    skills: userInfo.skills.map((skill) => skill.user_skills),
  };
}

export default function GenerateResume(props: { userInfo: UserInfo, userEmail: string, disableName?: boolean }) {
  // Resume information state
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo>(initializeResumeInfo(props.userInfo, props.userEmail));

  // Editor values
  const [focusedEditor, setFocusedEditor] = useState("disabled");
  const setNewName = useCallback((value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, name: value ?? "" })), [])
  const focusName = useCallback(() => setFocusedEditor("name"), []);

  // Drag and drop handlers
  const linkDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    const links = [...resumeInfo.links];
    const [removed] = links.splice(result.source.index, 1);
    links.splice(result.destination.index, 0, removed!);
    setResumeInfo((prev) => ({ ...prev, links }));
  }, [resumeInfo.links]);

  // Defining some helpful variables
  const letter = useMemo(() => <Resume info={resumeInfo} />, [resumeInfo]);

  const fullname = [props.userInfo.personal?.firstname, props.userInfo.personal?.lastname].filter(Boolean).join(" ")

  // The full view
  return (
    <>
      <div className="z-10 flex flex-col w-screen p-2 px-8 space-y-2 border rounded-lg shadow-xl h-[60vh] border-slate-400 bg-gradient-to-r from-slate-50 sm:sticky sm:top-1/4 sm:float-end sm:w-5/12 sm:px-2">
        <PDFViewerWidget pdf={letter} downloadFilename="resume.pdf" />
      </div>
      <div className={`w-screen space-y-2 rounded-lg border border-slate-400 bg-white p-2 px-8 text-sm mb-8 sm:mt-8 sm:w-3/5 sm:p-4`}>
        <div className="m-auto flex min-h-[80vh] w-[99%] flex-col">
          <div className="relative mb-3">
            <Toolbar id="mainToolbar" className={`relative left-0 top-0 ` + (focusedEditor === "disabled" ? 'pointer-events-none' : 'hidden')} />
            {(props.disableName !== true) && <Toolbar id="nameToolbar" className={`relative left-0 top-0 ` + (focusedEditor === "name" ? `` : `hidden`)} />}
            <Toolbar id="addressToolbar" className={`relative left-0 top-0 ` + (focusedEditor === "address" ? `` : `hidden`)} />
            <Toolbar id="phoneToolbar" className={`relative left-0 top-0 ` + (focusedEditor === "phone" ? `` : `hidden`)} />
            <Toolbar id="emailToolbar" className={`relative left-0 top-0 ` + (focusedEditor === "email" ? `` : `hidden`)} />
            {resumeInfo.links.map((link, idx) => (
              <div key={idx}>
                <Toolbar id={`linkDisplayToolbar-${idx}`} className={`relative left-0 top-0 ` + (focusedEditor === `linkDisplay-${idx}` ? `` : `hidden`)} />
              </div>
            ))}
          </div>
          <div>
            {/* PERSONAL INFO */}
            <p className="font-bold text-lg border-b border-b-black mt-3">PERSONAL</p>
            {(props.disableName !== true) && (<Editor
              toolbarId="nameToolbar"
              setValue={setNewName}
              onFocus={focusName}
              placeholder="Name"
              initial={fullname}
              singleLine
              className="ql-single-line"
            />)}
            <div className="flex">
              <Editor
                toolbarId="addressToolbar"
                setValue={useCallback((value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, address: value })), [])}
                onFocus={useCallback(() => setFocusedEditor("address"), [])}
                placeholder="Address"
                initial={props.userInfo.personal?.address ?? undefined}
                singleLine
                className="w-1/3 ql-single-line"
              />
              <Editor
                toolbarId="phoneToolbar"
                setValue={useCallback((value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, phone: value })), [])}
                onFocus={useCallback(() => setFocusedEditor("phone"), [])}
                placeholder="Phone"
                initial={props.userInfo.personal?.phone ?? undefined}
                singleLine
                className="w-1/3 ql-single-line"
              />
              <Editor
                toolbarId="emailToolbar"
                setValue={useCallback((value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, email: value })), [])}
                onFocus={useCallback(() => setFocusedEditor("email"), [])}
                placeholder="Email"
                initial={props.userEmail}
                singleLine
                className="w-1/3 ql-single-line"
              />
            </div>
            {/* Links */}
            <div className={`flex mt-1 gap-2 ${resumeInfo.links.length ? ` border-b border-b-black` : ``}`}>
              <p className="text-sm font-semibold">Links</p>
              <MdAdd className="self-center hover:text-slate-500 cursor-pointer" onClick={() => setResumeInfo((prev) => ({ ...prev, links: [...prev.links, { link: "", display: "" }] }))} />
            </div>
            <DragDropContext onDragEnd={linkDragEnd}>
              <StrictModeDroppable droppableId="links">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {resumeInfo.links.map((link, idx) => (
                      <Draggable key={idx} draggableId={idx.toString()} index={idx}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="flex group">
                            <MdDragIndicator className={`self-center text-lg absolute -ml-1 opacity-0 group-hover:opacity-100 ${snapshot.draggingOver ? `opacity-100` : ``}`}/>
                            <input
                              type="text"
                              value={link.link ?? ""}
                              onChange={(e) => setResumeInfo((prev) => ({ ...prev, links: prev.links.map((l, i) => i === idx ? { ...l, link: e.target.value } : l) }))}
                              onFocus={() => setFocusedEditor("disabled")}
                              defaultValue={link.link ?? ""}
                              placeholder="Personal link"
                              className={`w-1/2 resize-none outline-none py-1 px-[15px] text-[12.75px] placeholder-gray-600 ${!link.link ? `italic` : ``}`}
                            />
                            <Editor
                              toolbarId={`linkDisplayToolbar-${idx}`}
                              value={link.display ?? undefined}
                              setValue={(value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, links: prev.links.map((l, i) => i === idx ? { ...l, display: value } : l) }))}
                              onFocus={() => setFocusedEditor(`linkDisplay-${idx}`)}
                              placeholder="Display"
                              initial={link.display?.toString()}
                              singleLine
                              className="w-1/2 ql-single-line"
                            />
                            <MdRemove className="self-center mr-4 hover:text-slate-500 cursor-pointer" onClick={() => setResumeInfo((prev) => ({ ...prev, links: prev.links.filter((_, i) => i !== idx) }))} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </DragDropContext>
            {/* EXPERIENCE */}
            <p className="font-bold text-lg border-b border-b-black mt-3">EXPERIENCE</p>
            {/* EDUCATION */}
            <p className="font-bold text-lg border-b border-b-black mt-3">EDUCATION</p>
            <Editor
              toolbarId="mainToolbar"
              placeholder="Write your cover letter..."
              onFocus={useCallback(() => setFocusedEditor("main"), [])}
            />
            {/* SKILLS */}
            <p className="font-bold text-lg border-b border-b-black mt-3">SKILLS</p>
          </div>
        </div>
      </div>
    </>
  );
}
