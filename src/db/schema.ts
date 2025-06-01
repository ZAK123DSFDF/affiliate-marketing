import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

// USER SCHEMA (Sellers are users who create organizations)
export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ORGANIZATION SCHEMA
export const organization = pgTable("organization", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  ownerId: uuid("owner_id") // Direct reference to the owner
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

// TEAM MEMBERS (Only OWNER and ADMIN roles)
export const teamMember = pgTable(
  "team_member",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["OWNER", "ADMIN"] }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userOrgUnique: primaryKey({
      columns: [table.userId, table.organizationId],
    }),
  }),
);

// SIMPLIFIED INVITATION SYSTEM (Only for ADMINS)
export const invitation = pgTable("invitation", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  token: text("token")
    .notNull()
    .unique()
    .$defaultFn(() => createId()),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  inviterId: uuid("inviter_id") // Must be the owner
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AFFILIATE SCHEMA (unchanged)
export const affiliate = pgTable(
  "affiliate",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
  },
  (table) => ({
    orgEmailUnique: unique("org_email_unique").on(
      table.email,
      table.organizationId,
    ),
  }),
);

// RELATIONSHIPS
export const userRelations = relations(user, ({ many }) => ({
  organizations: many(organization, { relationName: "owner" }),
  teamMemberships: many(teamMember),
  sentInvitations: many(invitation, { relationName: "inviter" }),
}));

export const organizationRelations = relations(
  organization,
  ({ one, many }) => ({
    owner: one(user, {
      fields: [organization.ownerId],
      references: [user.id],
      relationName: "owner",
    }),
    teamMembers: many(teamMember),
    affiliates: many(affiliate),
    invitations: many(invitation),
  }),
);
