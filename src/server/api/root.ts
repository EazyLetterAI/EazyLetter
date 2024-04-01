import { openAIRouter } from "~/server/api/routers/ai";
import { letterRouter } from "~/server/api/routers/letter";
import { createTRPCRouter } from "~/server/api/trpc";
import { userInfoRouter } from "./routers/user-info";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  ai: openAIRouter,
  letter: letterRouter,
  userInfo: userInfoRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
