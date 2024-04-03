"use client";

import { UploadButton } from "~/utils/uploadthing";

const PdfUpload = (props: { fileCategory: string }) => {
  return <div>
    <UploadButton endpoint="pdfUploader" headers={{ fileCategory: props.fileCategory }} />
  </div>
};

export default PdfUpload;