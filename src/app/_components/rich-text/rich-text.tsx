"use client";

import dynamic from "next/dynamic";
import React, { useCallback, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import type ReactQuill from "react-quill";
import { Quill, type Range, type UnprivilegedEditor } from "react-quill";
import type { Delta as DeltaType, Sources, StringMap } from "quill";

const Delta = Quill.import("delta") as typeof DeltaType;
type Delta = DeltaType;

const QuillDynamicWrapper = dynamic(() => import("../rich-text/quill-dynamic"), {
  ssr: false,
  loading: () => (
    <textarea className="resize-none border border-black p-1 italic text-gray-500" value="Loading..." readOnly/>
  ),
});

const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  ["bold", "italic", "underline", "strike"], // toggled buttons

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme

  [{ align: [] }],

  [{ list: "ordered" }, { list: "bullet" }], // lists
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

  [{ font: [] }],

  ["clean"], // remove formatting button
];

const Editor = function Editor(props: {
  className?: string;
  placeholder?: string;
  value?: Delta;
  setValue?: (value: Delta) => void;
  toolbarId?: string;
  onFocus?: (range: Range, source: Sources, editor: UnprivilegedEditor) => void;
  singleLine?: boolean;
  editorRef?: React.RefObject<ReactQuill>;
  generateAIHandler?: (editor?: UnprivilegedEditor) => void;
}) {
  const editorRef = useRef<ReactQuill>(null);
  const effectiveRef = props.editorRef ?? editorRef;
  const [value, setValue] = useState<Delta>(props.value ?? new Delta());

  const generateHandler = props.generateAIHandler;
  const handlerWithEditor = useCallback(() => {
    generateHandler?.(effectiveRef.current?.makeUnprivilegedEditor(effectiveRef.current?.getEditor()));
  }, [effectiveRef, generateHandler])

  const editorModules: StringMap = {
    toolbar: {
      container: props.toolbarId ? `#${props.toolbarId}` : toolbarOptions,
      handlers: {
        generateLetter: handlerWithEditor,
      }
    },
  };

  const processValue = (value: Delta) => {
    if (props.singleLine) {
      let firstLine = new Delta();
      value.eachLine((line, attributes, idx) => {
        if (idx === 0) {
          line.ops?.forEach((op) => {
            firstLine = firstLine.insert(op.insert, { ...op.attributes });
          });
          firstLine = firstLine.insert("\n", { ...attributes });
        }
      });
      return firstLine;
    } else {
      return value;
    }
  };

  return (
    <QuillDynamicWrapper
      forwardRef={effectiveRef}
      theme="snow"
      modules={editorModules}
      value={
        props.value != undefined && props.setValue != undefined
          ? props.value
          : value
      }
      onChange={(value, delta, source, editor) => {
        props.value != undefined && props.setValue != undefined
          ? props.setValue(processValue(editor.getContents()))
          : setValue(processValue(editor.getContents()));
      }}
      onFocus={props.onFocus}
      className={props.className}
      placeholder={props.placeholder}
    />
  );
};

export default Editor;

export function Toolbar(props: { id: string; className?: string }) {
  return (
    <div id={props.id} className={"ql-toolbar ql-snow " + props.className}> {/* a bit hacky but necessary here */}
      <span className="ql-formats">
        <select className="ql-header" defaultValue="0">
          <option value="1"></option>
          <option value="2"></option>
          <option value="3"></option>
          <option value="4"></option>
          <option value="5"></option>
          <option value="6"></option>
          <option value="false"></option>
        </select>
      </span>
      <span className="ql-formats">
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <button className="ql-underline"></button>
        <button className="ql-strike"></button>
      </span>
      <span className="ql-formats">
        <select className="ql-color"></select>
        <select className="ql-background"></select>
      </span>
      <span className="ql-formats">
        <select className="ql-align"></select>
      </span>
      <span className="ql-formats">
        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>
        <button className="ql-indent" value="-1"></button>
        <button className="ql-indent" value="+1"></button>
      </span>
      <span className="ql-formats">
        <select className="ql-font"></select>
      </span>
      <span className="ql-formats">
        <button className="ql-clean"></button>
      </span>
      <span className="ql-formats">
        <button className="ql-generateLetter">
          <span className="font-bold">Generate with AI 🪄</span>
        </button>
      </span>
    </div>
  );
}
