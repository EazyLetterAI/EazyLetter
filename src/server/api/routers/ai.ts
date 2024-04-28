import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { api } from "~/trpc/server";

export const openAIRouter = createTRPCRouter({
  generateLetter: protectedProcedure
    .input(z.object({
      jobDetails: z.union([z.string().url(), z.string()]),
      applicantInfo: z.string(),
      dummy: z.boolean().optional(),
    }))
    .query(async ({ ctx, input }) => {
      if (input.dummy) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return {letter: "Dear Hiring Manager,\n\nI am writing to express my interest in the Software Engineer position at your company. I am confident that my experience and skills make me a great fit for this role. I have a strong background in software development and a passion for creating innovative solutions. I am excited about the opportunity to work with your team and contribute to your company's success.\n\nThank you for considering my application. I look forward to the opportunity to discuss how my experience and skills align with the needs of your team.\n\nSincerely,\nJohn Doe"};
      }

      // If the jobDetails is a URL, fetch the text from the site
      let jobDetails = input.jobDetails;
      try {
        const url = z.string().url().parse(input.jobDetails);
        const jobSiteText = await api.scraping.retrieveSiteText.query(url);
        jobDetails = jobSiteText?.text ?? "";
      } catch {
        // If the jobDetails is not a URL, it is a string
      }
      if (!jobDetails)
        throw new TRPCError({ code: "BAD_REQUEST", message: "Failed to fetch job details" });

      const userInfo = await api.userInfo.retrieveUserInfo.query() as object;

      // Query GPT to generate the letter
      const completion = await ctx.openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a helpful cover letter writer. Your users need help applying to jobs. 
            They need a cover letter that is tailored to the job and company they are applying to. 
            They will provide you with the job description, company description, and their own experiences. 
            You will use this information to generate a cover letter for them. They will give their data in JSON. 
            Output as plain text. Start the letter with Dear. End the letter with Sincerely.
            If you are not provided with enough company or applicant information, simply make the letter generic. 
            Do not acknowledge the lack of information in the letter.\nWe have some info on the user too: ${JSON.stringify(userInfo)}`,
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
});
