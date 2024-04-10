import * as schema from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const userInfoRouter = createTRPCRouter({
  retrieveUserInfo: protectedProcedure.query(async ({ ctx }) => {
    const personalInfo = (
      await ctx.db
        .select({
          firstname: schema.users.firstname,
          middlename: schema.users.middlename,
          lastname: schema.users.lastname,
          address: schema.users.address,
          phone: schema.users.phone,
        })
        .from(schema.users)
        .where(eq(schema.users.id, ctx.session.user.id))  // Filtering on the session user id
    )[0];

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

    const experienceInfo = await ctx.db
      .select({
        title: schema.userExperiences.title,
        type: schema.userExperiences.type,
        location: schema.userExperiences.location,
        startDate: schema.userExperiences.startDate,
        endDate: schema.userExperiences.endDate,
        description: schema.userExperiences.descriptions,
        link: schema.userExperiences.link,
      })
      .from(schema.userExperiences)
      .where(eq(schema.userExperiences.userId, ctx.session.user.id));

    const skillsInfo = await ctx.db
      .select({
        user_skills: schema.skills.skills,
      })
      .from(schema.skills)
      .where(eq(schema.skills.userId, ctx.session.user.id));

    const linksInfo = await ctx.db
      .select({
        type: schema.userLinks.type,
        link: schema.userLinks.link,
      })
      .from(schema.userLinks)
      .where(eq(schema.userLinks.userId, ctx.session.user.id));

    return {
      personal: personalInfo,
      education: educationInfo,
      experiences: experienceInfo,
      skills: skillsInfo,
      links: linksInfo,
    };
  }),

  updatePersonalInfo: protectedProcedure
    .input(
      z.object({
        firstname: z.string().trim().min(1, { message: "First name can't be empty" }),
        middlename: z.string().trim().optional(),
        lastname: z.string().trim().min(1, { message: "Last name can't be empty" }),
        address: z.string().trim().optional(),
        phone: z.string().trim().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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

  updateEducationInfo: protectedProcedure
    .input(
      z.array(
        z.object({
          schoolName: z.string().trim().min(1, { message: "School cannot be empty" }),
          location: z.string().trim(),
          startDate: z.date(),
          endDate: z.date(),
          gpa: z.string().trim(),
          degree: z.string().trim(),
          honors: z.string().trim(),
          relevantCoursework: z.string().trim(),
        }).refine(d => new Date(d.startDate) < new Date(d.endDate), { message: "Start date must be before end date" }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(schema.education)
        .where(eq(schema.education.userId, ctx.session.user.id));

      if (input.length) {
        await ctx.db.insert(schema.education).values(
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
          })),
        );
      }
    }),

  updateExperienceInfo: protectedProcedure
    .input(
      z.array(
        z.object({
          title: z.string().trim(),
          type: z.string().trim().min(1, { message: "Experience type cannot be empty" }),
          location: z.string().trim(),
          startDate: z.date(),
          endDate: z.date(),
          description: z.string().trim(),
          link: z.string().trim(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(schema.userExperiences)
        .where(eq(schema.userExperiences.userId, ctx.session.user.id));

      if (input.length) {
        await ctx.db.insert(schema.userExperiences).values(
          input.map((experiences) => ({
            userId: ctx.session.user.id,
            title: experiences.title,
            type: experiences.type,
            location: experiences.location,
            startDate: experiences.startDate,
            endDate: experiences.endDate,
            description: experiences.description,
            link: experiences.link,
          })),
        );
      }
    }),

  updateSkillsInfo: protectedProcedure
    .input(
      z.array(
        z.object({
          skill: z.string().trim()
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(schema.skills)
        .where(eq(schema.skills.userId, ctx.session.user.id));

      const nonEmptySkills = input.filter((s) => s.skill.length > 0);
      if (nonEmptySkills.length) {
        await ctx.db.insert(schema.skills).values(
          nonEmptySkills.map((skills) => ({
            userId: ctx.session.user.id,
            skills: skills.skill,
          })),
        );
      }
    }),

  updateLinkInfo: protectedProcedure
    .input(
      z.array(
        z.object({
          type: z.string().min(1, { message: "Specify a link type" }),
          link: z.string().min(1, { message: "Link cannot be empty" }),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(schema.userLinks)
        .where(eq(schema.userLinks.userId, ctx.session.user.id));

      if (input.length) {
        await ctx.db.insert(schema.userLinks).values(
          input.map((userlink) => ({
            userId: ctx.session.user.id,
            type: userlink.type,
            link: userlink.link,
          })),
        );
      }
    }),
});
