import dynamic from "next/dynamic";
import { RxOpenInNewWindow } from "react-icons/rx";

// These require dynamic imports since they are client only
const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), { ssr: false });
const BlobProvider = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.BlobProvider), { ssr: false });
const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {ssr: false });

export default function PDFViewerWidget(props: { pdf: React.ReactElement, downloadFilename?: string }) {
    return <>
      <PDFViewer width={"100%"} className="flex-grow" showToolbar={false}>
        {props.pdf}
      </PDFViewer>
      <div className="flex space-x-2">
        <PDFDownloadLink document={props.pdf} fileName={props.downloadFilename} className="flex-grow">
          <button
            className="w-full rounded-lg px-2 font-bold text-slate-800 outline outline-slate-800 duration-300 ease-in-out hover:bg-white hover:text-blue-500"
          >
            Download PDF
          </button>
        </PDFDownloadLink>
        <BlobProvider document={props.pdf}>
          {({ url }) => (
            <a href={url ?? ""} target="_blank">
              <button className="rounded-lg px-2 max-h-full h-full font-bold text-slate-800 outline outline-slate-800 duration-300 ease-in-out hover:bg-white hover:text-blue-500">
                <RxOpenInNewWindow />
              </button>
            </a>
          )}
        </BlobProvider>
      </div>
    </>
  }