import { postRouter } from "~/server/api/routers/post";
import { openAIRouter } from "~/server/api/routers/ai";
import { letterRouter } from "~/server/api/routers/letter";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  ai: openAIRouter,
  letter: letterRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
