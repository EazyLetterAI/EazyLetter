import ReactQuill from "react-quill"

// Incredibly hacky but necessary to allow for forward refs and dynamic imports...
export default function QuillForwardRefWrapper({ forwardRef, ...props }: React.ComponentProps<typeof ReactQuill> & { forwardRef: React.RefObject<ReactQuill> }) {
    return <ReactQuill ref={forwardRef} {...props} />
}