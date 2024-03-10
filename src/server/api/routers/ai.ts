import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const openAIRouter = createTRPCRouter({
  generateLetter: protectedProcedure
    .input(z.object({
      company: z.object({
        name: z.string(),
        address: z.string(),
        description: z.string()
      }),
      job: z.object({
        title: z.string(),
        start: z.date(),
        end: z.date(),
        description: z.string(),
      }),
      applicant: z.object({
        name: z.string(),
        experiences: z.array(z.object({
          type: z.union([z.literal("education"), z.literal("work"), z.literal("volunteer")]),
          start: z.date(),
          end: z.date(),
          title: z.string(),
          description: z.string()
        })),
      })
    }))
    .query(async ({ ctx, input }) => {
      const completion = await ctx.openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful cover letter writer. Your users need help applying to jobs. They need a cover letter that is tailored to the job and company they are applying to. They will provide you with the job description, company description, and their own experiences. You will use this information to generate a cover letter for them. They will give their data in JSON. Output as plain text.",
          },
          { 
            role: "user", 
            content: JSON.stringify(input)
          },
        ],
        model: "gpt-3.5-turbo-0125",
      });
      return {response: completion.choices[0]?.message.content};
    }),
  
  chatGPTMessage: protectedProcedure
    .input(z.object({ message: z.string() }))
    .query(async ({ ctx, input }) => {
      const chatCompletion = await ctx.openai.chat.completions.create({
        messages: [{ role: "user", content: input.message }],
        model: "gpt-3.5-turbo",
      });
      return {response: chatCompletion.choices[0]?.message.content};
    }),
});
