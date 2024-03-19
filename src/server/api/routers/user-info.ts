import { posts } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userInfoRouter = createTRPCRouter({
    retrieveUserInfo: protectedProcedure
        .query(async ({ ctx }) => {
            ctx.db.select().from(users).
            return {response: };
        })
});