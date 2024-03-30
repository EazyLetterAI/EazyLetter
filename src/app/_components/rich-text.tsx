"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import type { Delta } from "quill";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"], // toggled buttons

    [{ list: "ordered" }, { list: "bullet" }], // lists
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ],
};

export default function Editor(props: {
  className?: string;
  placeholder?: string;
  value?: Delta;
  setValue?: (value: Delta) => void;
}) {
  const [value, setValue] = useState(props.value);

  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      value={
        props.value != undefined && props.setValue != undefined
          ? props.value
          : value
      }
      onChange={(value, delta, source, editor) => {
        props.value != undefined && props.setValue != undefined
          ? props.setValue(editor.getContents())
          : setValue(editor.getContents());
      }}
      className={props.className}
      placeholder={props.placeholder}
    />
  );
}
