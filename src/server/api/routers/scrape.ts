import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { load } from "cheerio";

export const scrapingRouter = createTRPCRouter({
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
});