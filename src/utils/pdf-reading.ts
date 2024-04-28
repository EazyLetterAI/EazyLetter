import * as PDFJS from 'pdfjs-dist';
// @ts-expect-error See https://github.com/mozilla/pdf.js/discussions/17622
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

async function pdfToText(data: ArrayBuffer | string): Promise<string> {
  console.assert(data instanceof ArrayBuffer || typeof data === "string");

  const pdf = await PDFJS.getDocument(data).promise;

  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const string = textContent.items.map((item) => (item as TextItem).str || "").join(" ");
    pages.push(string);
  }

  return pages.join("\n\n");
}

// For running in a Web Worker
onmessage = async (event) => {
  try {
    const text = await pdfToText(event.data as ArrayBuffer | string);
    postMessage(text);
  } catch (e) {
    postMessage(e);
  }
}

export { pdfToText };
