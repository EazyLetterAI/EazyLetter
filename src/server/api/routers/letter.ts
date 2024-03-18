import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { load } from "cheerio";
import { api } from "~/trpc/server";
import { TRPCError } from "@trpc/server";
import { GenerateCoverLetter } from "~/server/pdf/pdf-generation";

export const letterRouter = createTRPCRouter({
  retrieveSiteText: protectedProcedure
    .input(z.string().url())
    .query(async ({ input }) => {
      const res = await fetch(input);
      if (res.ok) {
        const $ = load(await res.text());
        $("script").remove();
        $("style").remove();
        const text = $("body").text();
        const textWithoutWhitespace = text.replace(/\s+/g, "");
        return {text: textWithoutWhitespace};
      }
    }),

  generateLetter: protectedProcedure
    .input(z.object({
      jobDetails: z.union([z.string().url(), z.string()]),
      applicantInfo: z.string()
    }))
    .query(async ({ ctx, input }) => {
      // If the jobDetails is a URL, fetch the text from the site
      let jobDetails = input.jobDetails;
      if (z.string().url().safeParse(input.jobDetails)) {
        const jobSiteText = await api.letter.retrieveSiteText.query(input.jobDetails);
        jobDetails = jobSiteText?.text ?? "";
      }
      if (!jobDetails)
        throw new TRPCError({ code: "BAD_REQUEST", message: "Failed to fetch job details" });

      // Query GPT to generate the letter
      const completion = await ctx.openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful cover letter writer. Your users need help applying to jobs. They need a cover letter that is tailored to the job and company they are applying to. They will provide you with the job description, company description, and their own experiences. You will use this information to generate a cover letter for them. They will give their data in JSON. Output as plain text. Start the letter with Dear",
          },
          { 
            role: "user", 
            content: JSON.stringify({jobDetails: jobDetails, applicantInfo: input.applicantInfo})
          },
        ],
        model: "gpt-4",
      });
      return {letter: completion.choices[0]?.message.content};
    }),

  generateLetterPdf: protectedProcedure
    .input(z.object({letterContents: z.string()}))
    .query(async ({ input }) => {
      const buffer = await GenerateCoverLetter(input.letterContents);
      return {data: buffer.toString("base64")};
    }),
});