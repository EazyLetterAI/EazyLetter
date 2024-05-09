import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { load } from "cheerio";

// This is used to scrape a website and return the text of the site
// It could definitely be improved on, since many sites have a lot of irrelevant text
// and it tends to unnecessarily push GPT's token limit
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