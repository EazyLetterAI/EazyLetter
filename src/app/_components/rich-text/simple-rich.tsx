"use client";

import dynamic from "next/dynamic";
import React, { useRef, useState } from "react";
import type ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";

import type { Delta } from "quill";

const ReactQuillDynamic = dynamic(() => import("./quill-dynamic"), {
  ssr: false,
  loading: () => (
    <textarea
      className="resize-none border border-black p-1 italic text-gray-500"
      value="Loading..."
      readOnly
    />
  ),
});

const toolbarOptions = [["bold", "italic", "underline", "strike"]];

const editorModules = {
  toolbar: toolbarOptions,
};

const Editor = function Editor(props: {
  className?: string;
  placeholder?: string;
  singleLine?: boolean;
}) {
  const ref = useRef<ReactQuill>(null);

  const emptyDelta = () => {
    return ref.current?.getEditor().clipboard.convert("");
  }
  // const [value, setValue] = useState("");
  const [value, setValue] = useState<Delta | undefined>(emptyDelta());

  const processValue = (value: Delta) => {
    if (props.singleLine) {
      let firstLine = emptyDelta();
      value.eachLine((line, attributes, idx) => {
        if (idx === 0) {
          line.ops?.forEach((op) => {
            firstLine = firstLine?.insert(op.insert, { ...op.attributes });
          });
          firstLine = firstLine?.insert("\n", { ...attributes });
        }
      });
      return firstLine;
    } else {
      return value;
    }
  };

  return (
    <ReactQuillDynamic
      theme="snow"
      forwardRef={ref}
      modules={editorModules}
      value={value}
      onChange={(value, delta, source, editor) => {
        setValue(processValue(editor.getContents()));
      }}
      // onChange={(value) => setValue(value)}
      onBlur={() => ref.current?.focus()}
      className={props.className}
      placeholder={props.placeholder}
    />
  );
};

export default Editor;
