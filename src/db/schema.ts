import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  primaryKey,
  unique,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
export const roleEnum = pgEnum("role", ["OWNER", "ADMIN"]);
// USER SCHEMA (Sellers are users who create organizations)
export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  role: roleEnum("role").default("OWNER").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ORGANIZATION SCHEMA
export const organization = pgTable("organization", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  domainName: text("domain_name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// AFFILIATE SCHEMA (unchanged)
export const affiliate = pgTable(
  "affiliate",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      orgEmailUnique: unique("org_email_unique").on(
        table.email,
        table.organizationId,
      ),
    };
  },
);
export const invitation = pgTable("invitation", {
  id: uuid("id").primaryKey().defaultRandom(),

  email: text("email").notNull(), // Invitee's email
  inviterId: uuid("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),

  title: text("title"), // Optional email subject
  body: text("body"), // Optional message content

  token: text("token").notNull().unique(), // Unique invite token
  accepted: boolean("accepted").default(false).notNull(),

  expiresAt: timestamp("expires_at"), // Optional expiration
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const userToOrganization = pgTable(
  "user_to_organization",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.organizationId] }),
  }),
);
export const userRelations = relations(user, ({ many }) => ({
  usersToGroups: many(userToOrganization),
}));
export const organizationRelations = relations(organization, ({ many }) => ({
  usersToGroups: many(userToOrganization),
}));

export const usersToGroupsRelations = relations(
  userToOrganization,
  ({ one }) => ({
    group: one(organization, {
      fields: [userToOrganization.organizationId],
      references: [organization.id],
    }),
    user: one(user, {
      fields: [userToOrganization.userId],
      references: [user.id],
    }),
  }),
);
export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
}));
