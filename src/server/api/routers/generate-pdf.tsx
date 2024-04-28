import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import ReactPDF from "@react-pdf/renderer";
import { CoverLetter } from "~/utils/pdf-generation";

// This is leftover from when the PDF generation was done on the server but most likely doesn't work anymore
export const pdfRouter = createTRPCRouter({
  generateLetterPdf: protectedProcedure
    .input(z.object({ letterContents: z.string() }))
    .query(async ({ input }) => {
      const stream = await ReactPDF.renderToStream(
        <CoverLetter letterContents={input.letterContents} />,
      );
      const buffer = await new Promise<Buffer>(function (resolve, reject) {
        const buffers: Buffer[] = [];
        stream.on("data", (data: Buffer) => {
          buffers.push(data);
        });
        stream.on("end", () => {
          resolve(Buffer.concat(buffers));
        });
        stream.on("error", reject);
      });
      return { data: buffer.toString("base64") };
    }),
});
