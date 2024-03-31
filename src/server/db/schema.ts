import { relations, sql } from "drizzle-orm";
import {
  index,
  int,
  date,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `eazyletter_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
  firstname: varchar("name", { length: 255 }).notNull().default("First name"),
  middlename: varchar("middlename", { length: 255 }),
  lastname: varchar("lastname", { length: 255 }).notNull().default("Last name"),
  address: varchar("address", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
});

export const userLinks = createTable("userLink", {
  userId: varchar("userId", { length: 255 }).notNull()
    .references(() => users.id),
  type: varchar("type", { length: 255 }).notNull(),
  link: varchar("link", { length: 255 }).notNull(),
}, (userLink) => ({
  primaryKey: primaryKey({columns: [userLink.userId, userLink.type]}),
  userIdIdx: index("userLink_userId_idx").on(userLink.userId),
}));

export const userLinksRelations = relations(userLinks, ({ one }) => ({
  user: one(users, { fields: [userLinks.userId], references: [users.id] }),
}));

export const userExperiences = createTable("userExperience", {
  userId: varchar("userId", { length: 255 }).notNull()
    .references(() => users.id),
  // experienceName: varchar("experienceName", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }),
  location: varchar("location", { length: 255 }),
  startDate: date("startDate").notNull(),
  endDate: date("endDate"), 
  descriptions: varchar("descriptions", { length: 255 }),            
  type: varchar("type", { length: 255 }).notNull(),
  link: varchar("link", { length: 255}),  // link related to that experience, can be a website, github repo, etc.
});

export const experienceRelations = relations(userExperiences, ({ one }) => ({
  user: one(users, { fields: [userExperiences.userId], references: [users.id] }),
}));

export const education = createTable("education", {
  userId: varchar("userId", { length: 255 }).notNull()
    .references(() => users.id),
  schoolName: varchar("schoolName", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  gpa: varchar("gpa", { length: 255 }),
  degree: varchar("degree", { length: 255 }),
  honors: varchar("honors", { length: 255 }),
  relevantCoursework: varchar("relevantCoursework", { length: 255 }),
});

export const educationRelations = relations(education, ({ one }) => ({
  user: one(users, { fields: [education.userId], references: [users.id] }),
}));

export const skills = createTable("skills", {
  userId: varchar("userId", { length: 255 }).notNull()
    .references(() => users.id),
  skills: varchar("skills", { length: 255 }),
})

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accounts = createTable("account", {
  userId: varchar("userId", { length: 255 }).notNull()
    .references(() => users.id),
  type: varchar("type", { length: 255 })
    .$type<AdapterAccount["type"]>()
    .notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: int("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  id_token: text("id_token"),
  session_state: varchar("session_state", { length: 255 }),
}, (account) => ({
  compoundKey: primaryKey({
    columns: [account.provider, account.providerAccountId],
  }),
  userIdIdx: index("account_userId_idx").on(account.userId),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 })
    .notNull()
    .primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (session) => ({
  userIdIdx: index("session_userId_idx").on(session.userId),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable("verificationToken", {
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (vt) => ({
  compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
}));
