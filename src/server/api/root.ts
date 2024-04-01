import { openAIRouter } from "~/server/api/routers/ai";
import { pdfRouter } from "~/server/api/routers/generate-pdf";
import { scrapingRouter } from "~/server/api/routers/scrape";
import { createTRPCRouter } from "~/server/api/trpc";
import { userInfoRouter } from "./routers/user-info";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  ai: openAIRouter,
  pdf: pdfRouter,
  scraping: scrapingRouter
  userInfo: userInfoRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
