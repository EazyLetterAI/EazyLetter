"use client";

import dynamic from "next/dynamic";
import React, { memo, useCallback, useEffect, useRef } from "react";
import "react-quill/dist/quill.snow.css";
import type ReactQuill from "react-quill";
import { type Range, type UnprivilegedEditor } from "react-quill";
import type { Delta, Sources, StringMap } from "quill";

// For an explanation of some seemingly strange decisions made in dealing with Quill, see https://github.com/zenoamaro/react-quill/issues/962

const ReactQuillDynamic = dynamic(() => import("../rich-text/quill-dynamic"), {
  ssr: false,
  loading: () => (
    <textarea className="resize-none italic text-gray-500" value="Loading..." readOnly/>
  ),
});

const toolbarOptions = [
  [{ font: [] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  ["bold", "italic", "underline", "strike"], // toggled buttons

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme


  [{ list: "ordered" }, { list: "bullet" }], // lists
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ align: [] }],

  ["clean"], // remove formatting button
];

const enabledFormats = [
  "font",
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "indent",
  "align",
  "link",
];

export const makeNewDelta = (editor: ReactQuill | null, initial?: string) => {
  return editor?.getEditor().clipboard.convert(initial ?? "");
};

const Editor = memo(function Editor(props: {
  className?: string;
  placeholder?: string;
  initial?: string;
  value?: Delta | string | undefined;
  setValue?: (value: Delta | string | undefined) => void;
  toolbarId?: string;
  onFocus?: (range: Range, source: Sources, editor: UnprivilegedEditor) => void;
  singleLine?: boolean;
  editorRef?: React.RefObject<ReactQuill>;
  generateAIHandler?: (editor?: UnprivilegedEditor) => void;
}) {
  const { setValue, initial } = props;
  useEffect(() => {
    if (setValue && initial) {
      setValue(initial);
    }
  }, [setValue, initial]);

  const editorRef = useRef<ReactQuill>(null);
  const effectiveRef = props.editorRef ?? editorRef;

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
      let firstLine = makeNewDelta(effectiveRef.current);
      value.eachLine((line, attributes, idx) => {
        if (idx === 0) {
          line.ops?.forEach((op) => {
            firstLine = firstLine?.insert(op.insert, { ...op.attributes });
          });
          firstLine = firstLine?.insert("\n", { ...attributes });
        }
      });
      return firstLine ?? props.initial;  // if value is undefined, return the initial value
    } else {
      return value ?? props.initial;
    }
  };

  return (
    <ReactQuillDynamic
      forwardRef={effectiveRef}
      theme="snow"
      modules={editorModules}
      formats={enabledFormats}
      defaultValue={props.initial}
      value={props.value ?? props.initial}
      onChange={(value, delta, source, editor) => { props.setValue != undefined ? props.setValue(processValue(editor.getContents())) : undefined; }}
      onFocus={props.onFocus}
      className={props.className}
      placeholder={props.placeholder}
    />
  );
});

export default Editor;

export function Toolbar(props: { id: string; className?: string }) {
  return (
    <div id={props.id} className={"ql-toolbar ql-snow " + props.className}> {/* a bit hacky but necessary here */}
      <span className="ql-formats">
        <select className="ql-font"></select>
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
        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>
      </span>
      <span className="ql-formats">
        <button className="ql-indent" value="-1"></button>
        <button className="ql-indent" value="+1"></button>
      </span>
      <span className="ql-formats">
        <button className="ql-link"></button>
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
