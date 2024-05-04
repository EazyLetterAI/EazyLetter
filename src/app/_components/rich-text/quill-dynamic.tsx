import ReactQuill from "react-quill"
import { type StringMap } from "quill"

// Incredibly hacky but necessary to allow for forward refs afaik
export default function QuillForwardRefWrapper({ forwardRef, ...props }: React.ComponentProps<typeof ReactQuill> & { forwardRef: React.RefObject<ReactQuill> }) {
  const Font = ReactQuill.Quill.import("formats/font") as StringMap;
  Font.whitelist = ["default", "sans-serif", "serif", "monospace"];
  ReactQuill.Quill.register(Font, true);
  return <ReactQuill ref={forwardRef} {...props} />
}