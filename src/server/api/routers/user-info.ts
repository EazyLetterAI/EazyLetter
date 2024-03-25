import * as schema from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const userInfoRouter = createTRPCRouter({
  retrieveUserInfo: protectedProcedure.query(async ({ ctx }) => {
    const personalInfo = (await ctx.db
      .select({
        firstname: schema.users.firstname,
        middlename: schema.users.middlename,
        lastname: schema.users.lastname,
        address: schema.users.address,
        phone: schema.users.phone,
      })
      .from(schema.users)
      .where(eq(schema.users.id, ctx.session.user.id)))[0];
    
    const educationInfo = await ctx.db
      .select({
        schoolName: schema.education.schoolName,
        location: schema.education.location,
        startDate: schema.education.startDate,
        endDate: schema.education.endDate,
        gpa: schema.education.gpa,
        degree: schema.education.degree,
        honors: schema.education.honors,
        relevantCoursework: schema.education.relevantCoursework,
      })
      .from(schema.education)
      .where(eq(schema.education.userId, ctx.session.user.id));

    return {
      personal: personalInfo,
      education: educationInfo,
    };
  }),

  updatePersonalInfo: protectedProcedure.input(
    z.object({
      firstname: z.string().optional(),
      middlename: z.string().optional(),
      lastname: z.string().optional(),
      address: z.string().optional(),
      phone: z.string().optional(),
    })
  ).mutation(async ({ ctx, input }) => {
    await ctx.db
      .update(schema.users)
      .set({
        firstname: input.firstname,
        middlename: input.middlename,
        lastname: input.lastname,
        address: input.address,
        phone: input.phone,
      })
      .where(eq(schema.users.id, ctx.session.user.id));
  }),

  updateEducationInfo: protectedProcedure.input(
    z.array(
      z.object({
        schoolName: z.string(),
        location: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        gpa: z.string(),
        degree: z.string(),
        honors: z.string(),
        relevantCoursework: z.string(),
      })
    )
  ).mutation(async ({ ctx, input }) => {
    await ctx.db
      .delete(schema.education)
      .where(eq(schema.education.userId, ctx.session.user.id));

    await ctx.db
      .insert(schema.education)
      .values(
        input.map((education) => ({
          userId: ctx.session.user.id,
          schoolName: education.schoolName,
          location: education.location,
          startDate: education.startDate,
          endDate: education.endDate,
          gpa: education.gpa,
          degree: education.degree,
          honors: education.honors,
          relevantCoursework: education.relevantCoursework,
        }))
      );
  }),
});
