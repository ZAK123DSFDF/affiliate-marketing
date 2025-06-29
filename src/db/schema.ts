import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  primaryKey,
  unique,
  pgEnum,
  integer,
  uniqueIndex,
  index,
  jsonb,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { generateAffiliateCode } from "@/util/AffiliateCodes";
export const roleEnum = pgEnum("role", ["OWNER", "ADMIN"]);
export const accountTypeEnum = pgEnum("account_type", ["SELLER", "AFFILIATE"]);
export const paymentProviderEnum = pgEnum("payment_provider", [
  "stripe",
  "lemon_squeezy",
  "paddle",
]);
// USER SCHEMA (Sellers are users who create organizations)
export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  role: roleEnum("role").default("OWNER").notNull(),
  image: text("image"),
  type: accountTypeEnum("type").default("SELLER").notNull(),
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
    password: text("password").notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    type: accountTypeEnum("type").default("AFFILIATE").notNull(),
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
export const exchangeRate = pgTable(
  "exchange_rate",
  {
    baseCurrency: text("base_currency").notNull(),
    targetCurrency: text("target_currency").notNull(),
    rate: text("rate").notNull(),
    fetchedAt: timestamp("fetched_at").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.baseCurrency, t.targetCurrency] }),
  }),
);
export const affiliateLink = pgTable("affiliate_link", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code")
    .notNull()
    .unique()
    .$defaultFn(() => generateAffiliateCode()),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  // Foreign keys
  affiliateId: uuid("affiliate_id")
    .notNull()
    .references(() => affiliate.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
});
export const affiliatePayment = pgTable("affiliate_payment", {
  id: uuid("id").primaryKey().defaultRandom(),
  paymentProvider: paymentProviderEnum("payment_provider").notNull(),
  paymentId: text("payment_id").notNull().unique(),
  customerId: text("customer_id").notNull().unique(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  commission: integer("commission").notNull(),
  affiliateLinkId: uuid("affiliate_link_id")
    .notNull()
    .references(() => affiliateLink.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const checkTransaction = pgTable("check_transaction", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: text("customer_id").notNull(),
  subscriptionId: text("subscription_id"),
  amount: numeric("amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"),
  currency: text("currency").notNull(),
  expirationDate: timestamp("expiration_date").notNull(),
  customData: jsonb("custom_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const invitation = pgTable("invitation", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  inviterId: uuid("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),

  title: text("title"), // Optional email subject
  body: text("body"), // Optional message content

  token: text("token")
    .notNull()
    .unique()
    .$defaultFn(() => createId()), // Unique invite token
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
  userToOrganization: many(userToOrganization),
}));
export const organizationRelations = relations(organization, ({ many }) => ({
  userToOrganization: many(userToOrganization),
  affiliateLinks: many(affiliateLink),
}));
export const affiliateRelations = relations(affiliate, ({ many }) => ({
  affiliateLinks: many(affiliateLink),
}));
export const affiliateLinkRelations = relations(affiliateLink, ({ one }) => ({
  affiliate: one(affiliate, {
    fields: [affiliateLink.affiliateId],
    references: [affiliate.id],
  }),
  organization: one(organization, {
    fields: [affiliateLink.organizationId],
    references: [organization.id],
  }),
}));
export const userToOrganizationRelations = relations(
  userToOrganization,
  ({ one }) => ({
    organization: one(organization, {
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
