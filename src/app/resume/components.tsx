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
    objective: "",
    experiences: userInfo.experiences.map((exp) => ({
      type: exp.type,
      title: exp.title,
      subtitle: "",
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
      details: "GPA: " + edu.gpa,
    })),
    links: userInfo.links.map((link) => ({
      display: link.type,
      link: link.link,
    })),
    skills: userInfo.skills.join(", "),
  };
}

// This works fine but unfortunately the items within the lists rerender on every keystroke (since useCallback can't be used)
export default function GenerateResume(props: { userInfo: UserInfo, userEmail: string, disableName?: boolean, headerId?: string }) {
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

  const experienceDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    const experiences = [...resumeInfo.experiences];
    const [removed] = experiences.splice(result.source.index, 1);
    experiences.splice(result.destination.index, 0, removed!);
    setResumeInfo((prev) => ({ ...prev, experiences }));
  }, [resumeInfo.experiences]);

  const educationDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    const education = [...resumeInfo.education];
    const [removed] = education.splice(result.source.index, 1);
    education.splice(result.destination.index, 0, removed!);
    setResumeInfo((prev) => ({ ...prev, education }));
  }, [resumeInfo.education]);

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
          <div className="mb-3 sticky bg-white z-40" style={{ top: `${(headerHeight - 0.1).toFixed(1)}px` }}>
            <Toolbar id="disabledToolbar" className={`relative left-0 top-0 ` + (focusedEditor === "disabled" ? 'pointer-events-none' : 'hidden')} />
            <div className="hidden"><Editor toolbarId="disabledToolbar" singleLine /></div>
            {(props.disableName !== true) && <Toolbar id="nameToolbar" className={`relative left-0 top-0 ` + (focusedEditor === "name" ? `` : `hidden`)} />}
            <Toolbar id="addressToolbar" className={`relative left-0 top-0 ` + (focusedEditor === "address" ? `` : `hidden`)} />
            <Toolbar id="phoneToolbar" className={`relative left-0 top-0 ` + (focusedEditor === "phone" ? `` : `hidden`)} />
            <Toolbar id="emailToolbar" className={`relative left-0 top-0 ` + (focusedEditor === "email" ? `` : `hidden`)} />
            <Toolbar id="objectiveToolbar" className={`relative left-0 top-0 ` + (focusedEditor === "objective" ? `` : `hidden`)} />
            {resumeInfo.links.map((link, idx) => (
              <div key={idx}>
                <Toolbar id={`linkDisplayToolbar-${idx}`} className={`relative left-0 top-0 ` + (focusedEditor === `linkDisplay-${idx}` ? `` : `hidden`)} />
              </div>
            ))}
            {resumeInfo.experiences.map((_, idx) => (
              <div key={idx}>
                <Toolbar id={`expTitleToolbar-${idx}`} className={`relative left-0 top-0 ` + (focusedEditor === `expTitle-${idx}` ? `` : `hidden`)} />
                <Toolbar id={`expSubtitleToolbar-${idx}`} className={`relative left-0 top-0 ` + (focusedEditor === `expSubtitle-${idx}` ? `` : `hidden`)} />
                <Toolbar id={`expLocationToolbar-${idx}`} className={`relative left-0 top-0 ` + (focusedEditor === `expLocation-${idx}` ? `` : `hidden`)} />
                <Toolbar id={`expStartDateToolbar-${idx}`} className={`relative left-0 top-0 ` + (focusedEditor === `expStartDate-${idx}` ? `` : `hidden`)} />
                <Toolbar id={`expEndDateToolbar-${idx}`} className={`relative left-0 top-0 ` + (focusedEditor === `expEndDate-${idx}` ? `` : `hidden`)} />
                <Toolbar id={`expDescriptionToolbar-${idx}`} className={`relative left-0 top-0 ` + (focusedEditor === `expDescription-${idx}` ? `` : `hidden`)} />
              </div>
            ))}
            {resumeInfo.education.map((_, idx) => (
              <div key={idx}>
                <Toolbar id={`eduSchoolToolbar-${idx}`} className={`relative left-0 top-0 ` + (focusedEditor === `eduSchool-${idx}` ? `` : `hidden`)} />
                <Toolbar id={`eduLocationToolbar-${idx}`} className={`relative left-0 top-0 ` + (focusedEditor === `eduLocation-${idx}` ? `` : `hidden`)} />
                <Toolbar id={`eduStartDateToolbar-${idx}`} className={`relative left-0 top-0 ` + (focusedEditor === `eduStartDate-${idx}` ? `` : `hidden`)} />
                <Toolbar id={`eduEndDateToolbar-${idx}`} className={`relative left-0 top-0 ` + (focusedEditor === `eduEndDate-${idx}` ? `` : `hidden`)} />
                <Toolbar id={`eduDetailsToolbar-${idx}`} className={`relative left-0 top-0 ` + (focusedEditor === `eduDetails-${idx}` ? `` : `hidden`)} />
              </div>
            ))}
            <Toolbar id="skillsToolbar" className={`relative left-0 top-0 ` + (focusedEditor === "skills" ? `` : `hidden`)} />
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
              className="ql-compact"
            />)}
            <div className="flex">
              <Editor
                toolbarId="addressToolbar"
                setValue={useCallback((value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, address: value })), [])}
                onFocus={useCallback(() => setFocusedEditor("address"), [])}
                placeholder="Address"
                initial={props.userInfo.personal?.address ?? undefined}
                singleLine
                className="w-1/3 ql-compact"
              />
              <Editor
                toolbarId="phoneToolbar"
                setValue={useCallback((value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, phone: value })), [])}
                onFocus={useCallback(() => setFocusedEditor("phone"), [])}
                placeholder="Phone"
                initial={props.userInfo.personal?.phone ?? undefined}
                singleLine
                className="w-1/3 ql-compact"
              />
              <Editor
                toolbarId="emailToolbar"
                setValue={useCallback((value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, email: value })), [])}
                onFocus={useCallback(() => setFocusedEditor("email"), [])}
                placeholder="Email"
                initial={props.userEmail}
                singleLine
                className="w-1/3 ql-compact"
              />
            </div>
            <Editor
              toolbarId="objectiveToolbar"
              setValue={useCallback((value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, objective: value })), [])}
              onFocus={useCallback(() => setFocusedEditor("objective"), [])}
              placeholder="Objective"
              initial={resumeInfo.objective as string}
              className="ql-compact"
            />
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
                            <MdDragIndicator className={`self-center text-lg absolute -ml-1 opacity-0 group-hover:opacity-100 ${snapshot.draggingOver ? `opacity-100` : ``}`} />
                            <input
                              type="text"
                              value={link.link ?? ""}
                              onChange={(e) => setResumeInfo((prev) => ({ ...prev, links: prev.links.map((l, i) => i === idx ? { ...l, link: e.target.value } : l) }))}
                              onFocus={() => setFocusedEditor("disabled")}
                              defaultValue={link.link ?? ""}
                              placeholder="Personal link"
                              className={`w-1/2 resize-none outline-none bg-transparent py-1 px-[15px] text-[12.75px] placeholder-gray-600 ${!link.link ? `italic` : ``}`}
                            />
                            <Editor
                              toolbarId={`linkDisplayToolbar-${idx}`}
                              value={link.display ?? undefined}
                              setValue={(value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, links: prev.links.map((l, i) => i === idx ? { ...l, display: value } : l) }))}
                              onFocus={() => setFocusedEditor(`linkDisplay-${idx}`)}
                              placeholder="Display"
                              initial={link.display?.toString()}
                              singleLine
                              className="w-1/2 ql-compact"
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
            <div className={`flex mt-3 gap-2 ${resumeInfo.experiences.length ? ` border-b border-b-black` : ``}`}>
              <p className="font-bold text-lg">EXPERIENCE</p>
              <MdAdd className="self-center hover:text-slate-500 cursor-pointer" onClick={() => setResumeInfo((prev) => ({ ...prev, experiences: [...prev.experiences, { title: "", type: "", location: "", startDate: "", endDate: "", link: "", description: "" }] }))} />
            </div>
            <DragDropContext onDragEnd={experienceDragEnd}>
              <StrictModeDroppable droppableId="experiences">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-2">
                    {resumeInfo.experiences.map((exp, idx) => (
                      <Draggable key={idx} draggableId={idx.toString()} index={idx}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="flex group">
                            <MdDragIndicator className={`self-center text-lg absolute -ml-1 opacity-0 group-hover:opacity-100 ${snapshot.draggingOver ? `opacity-100` : ``}`} />
                            <div className="flex-grow">
                              <div className="flex">
                                <Editor
                                  toolbarId={`expTitleToolbar-${idx}`}
                                  value={exp.title ?? undefined}
                                  setValue={(value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, experiences: prev.experiences.map((e, i) => i === idx ? { ...e, title: value } : e) }))}
                                  onFocus={() => setFocusedEditor(`expTitle-${idx}`)}
                                  placeholder="Title"
                                  initial={exp.title?.toString()}
                                  singleLine
                                  className="w-1/3 ql-compact"
                                />
                                <Editor
                                  toolbarId={`expSubtitleToolbar-${idx}`}
                                  value={exp.subtitle ?? undefined}
                                  setValue={(value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, experiences: prev.experiences.map((e, i) => i === idx ? { ...e, subtitle: value } : e) }))}
                                  onFocus={() => setFocusedEditor(`expSubtitle-${idx}`)}
                                  placeholder="Subtitle/Employer"
                                  initial={exp.subtitle?.toString()}
                                  singleLine
                                  className="w-1/3 ql-compact"
                                />
                                <input
                                  type="text"
                                  value={exp.link ?? ""}
                                  onChange={(event) => setResumeInfo((prev) => ({ ...prev, experiences: prev.experiences.map((e, i) => i === idx ? { ...e, link: event.target.value } : e) }))}
                                  onFocus={() => setFocusedEditor("disabled")}
                                  defaultValue={exp.link ?? ""}
                                  placeholder="Link"
                                  className={`w-1/3 resize-none outline-none bg-transparent py-1 px-[15px] text-[12.75px] placeholder-gray-600 ${!exp.link ? `italic` : ``}`}
                                />
                              </div>
                              <div className="flex">
                                <Editor
                                  toolbarId={`expLocationToolbar-${idx}`}
                                  value={exp.location ?? undefined}
                                  setValue={(value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, experiences: prev.experiences.map((e, i) => i === idx ? { ...e, location: value } : e) }))}
                                  onFocus={() => setFocusedEditor(`expLocation-${idx}`)}
                                  placeholder="Location"
                                  initial={exp.location?.toString()}
                                  singleLine
                                  className="w-1/3 ql-compact"
                                />
                                <Editor
                                  toolbarId={`expStartDateToolbar-${idx}`}
                                  value={exp.startDate ?? undefined}
                                  setValue={(value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, experiences: prev.experiences.map((e, i) => i === idx ? { ...e, startDate: value ?? "" } : e) }))}
                                  onFocus={() => setFocusedEditor(`expStartDate-${idx}`)}
                                  placeholder="Start Date"
                                  initial={(exp.startDate as string)?.toString()}
                                  singleLine
                                  className="w-1/3 ql-compact"
                                />
                                <Editor
                                  toolbarId={`expEndDateToolbar-${idx}`}
                                  value={exp.endDate ?? undefined}
                                  setValue={(value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, experiences: prev.experiences.map((e, i) => i === idx ? { ...e, endDate: value } : e) }))}
                                  onFocus={() => setFocusedEditor(`expEndDate-${idx}`)}
                                  placeholder="End Date"
                                  initial={exp.endDate?.toString()}
                                  singleLine
                                  className="w-1/3 ql-compact"
                                />
                              </div>
                              <Editor
                                toolbarId={`expDescriptionToolbar-${idx}`}
                                value={exp.description ?? undefined}
                                setValue={(value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, experiences: prev.experiences.map((e, i) => i === idx ? { ...e, description: value } : e) }))}
                                onFocus={() => setFocusedEditor(`expDescription-${idx}`)}
                                placeholder="Description"
                                initial={exp.description?.toString()}
                                className="ql-compact"
                              />
                            </div>
                            <MdRemove className="self-center mr-4 hover:text-slate-500 cursor-pointer" onClick={() => setResumeInfo((prev) => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== idx) }))} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </DragDropContext>
            {/* EDUCATION */}
            <div className={`flex mt-3 gap-2 ${resumeInfo.education.length ? ` border-b border-b-black` : ``}`}>
              <p className="font-bold text-lg">EDUCATION</p>
              <MdAdd className="self-center hover:text-slate-500 cursor-pointer" onClick={() => setResumeInfo((prev) => ({ ...prev, education: [...prev.education, { schoolName: "", location: "", startDate: "", endDate: "", details: "" }] }))} />
            </div>
            <DragDropContext onDragEnd={educationDragEnd}>
              <StrictModeDroppable droppableId="education">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-2">
                    {resumeInfo.education.map((edu, idx) => (
                      <Draggable key={idx} draggableId={idx.toString()} index={idx}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="flex group">
                            <MdDragIndicator className={`self-center text-lg absolute -ml-1 opacity-0 group-hover:opacity-100 ${snapshot.draggingOver ? `opacity-100` : ``}`} />
                            <div className="flex-grow">
                              <div className="flex">
                                <Editor
                                  toolbarId={`eduSchoolToolbar-${idx}`}
                                  value={edu.schoolName ?? undefined}
                                  setValue={(value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, education: prev.education.map((e, i) => i === idx ? { ...e, schoolName: value! } : e) }))}
                                  onFocus={() => setFocusedEditor(`eduSchool-${idx}`)}
                                  placeholder="School Name"
                                  initial={(edu.schoolName as string)?.toString()}
                                  singleLine
                                  className="w-1/2 ql-compact"
                                />
                                <Editor
                                  toolbarId={`eduLocationToolbar-${idx}`}
                                  value={edu.location ?? undefined}
                                  setValue={(value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, education: prev.education.map((e, i) => i === idx ? { ...e, location: value } : e) }))}
                                  onFocus={() => setFocusedEditor(`eduLocation-${idx}`)}
                                  placeholder="Location"
                                  initial={edu.location?.toString()}
                                  singleLine
                                  className="w-1/3 ql-compact"
                                />
                                <Editor
                                  toolbarId={`eduStartDateToolbar-${idx}`}
                                  value={edu.startDate ?? undefined}
                                  setValue={(value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, education: prev.education.map((e, i) => i === idx ? { ...e, startDate: value! } : e) }))}
                                  onFocus={() => setFocusedEditor(`eduStartDate-${idx}`)}
                                  placeholder="Start Date"
                                  initial={(edu.startDate as string)?.toString()}
                                  singleLine
                                  className="w-1/3 ql-compact"
                                />
                                <Editor
                                  toolbarId={`eduEndDateToolbar-${idx}`}
                                  value={edu.endDate ?? undefined}
                                  setValue={(value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, education: prev.education.map((e, i) => i === idx ? { ...e, endDate: value } : e) }))}
                                  onFocus={() => setFocusedEditor(`eduEndDate-${idx}`)}
                                  placeholder="End Date"
                                  initial={edu.endDate?.toString()}
                                  singleLine
                                  className="w-1/3 ql-compact"
                                />
                              </div>
                              <Editor
                                toolbarId={`eduDetailsToolbar-${idx}`}
                                value={edu.details ?? undefined}
                                setValue={(value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, education: prev.education.map((e, i) => i === idx ? { ...e, details: value } : e) }))}
                                onFocus={() => setFocusedEditor(`eduDetails-${idx}`)}
                                placeholder="Details"
                                initial={edu.details?.toString()}
                                className="ql-compact"
                              />
                            </div>
                            <MdRemove className="self-center mr-4 hover:text-slate-500 cursor-pointer" onClick={() => setResumeInfo((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }))} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </DragDropContext>
            {/* SKILLS */}
            <p className="font-bold text-lg border-b border-b-black mt-3">SKILLS</p>
            <Editor
              toolbarId="skillsToolbar"
              setValue={useCallback((value: string | Delta | undefined) => setResumeInfo((prev) => ({ ...prev, skills: value })), [])}
              onFocus={useCallback(() => setFocusedEditor("skills"), [])}
              placeholder="Skills/More Details"
              initial={resumeInfo.skills as string}
              className="ql-compact"
            />
          </div>
        </div>
      </div>
    </>
  );
}
