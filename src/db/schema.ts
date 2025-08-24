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
  jsonb,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import {
  generateAffiliateClickId,
  generateAffiliateCode,
  generateAffiliatePaymentLinkId,
  generateInviteLinkId,
  generateOrganizationId,
} from "@/util/idGenerators";
export const roleEnum = pgEnum("role", ["OWNER", "ADMIN"]);
export const accountTypeEnum = pgEnum("account_type", ["SELLER", "AFFILIATE"]);
export const paymentProviderEnum = pgEnum("payment_provider", [
  "stripe",
  "paddle",
]);
export const referralParamEnum = pgEnum("referral_param_enum", [
  "ref",
  "via",
  "aff",
]);
export const payoutProviderEnum = pgEnum("payout_provider", [
  "paypal",
  "wise",
  "payoneer",
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
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateOrganizationId()),
  name: text("name").notNull(),
  domainName: text("domain_name").notNull().unique(),
  logoUrl: text("logo_url"), // Optional logo
  referralParam: referralParamEnum("referral_param").default("ref"), // e.g., ref/aff
  cookieLifetimeValue: integer("cookie_lifetime_value").default(30), // e.g., 30
  cookieLifetimeUnit: text("cookie_lifetime_unit").default("day"), // year/month/week/day
  commissionType: text("commission_type").default("percentage"), // 'percentage' or 'fixed'
  commissionValue: numeric("commission_value", {
    precision: 10,
    scale: 2,
  }).default("0.00"),
  commissionDurationValue: integer("commission_duration_value").default(0),
  commissionDurationUnit: text("commission_duration_unit").default("day"),
  expirationDate: timestamp("expiration_date").defaultNow().notNull(),
  currency: text("currency").default("USD"),
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
    organizationId: text("organization_id")
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
export const affiliatePayoutMethod = pgTable("affiliate_payout_method", {
  id: uuid("id").primaryKey().defaultRandom(),
  affiliateId: uuid("affiliate_id")
    .notNull()
    .references(() => affiliate.id, { onDelete: "cascade" }),

  provider: payoutProviderEnum("provider").notNull(),
  accountIdentifier: text("account_identifier").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
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
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateAffiliateCode()),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  affiliateId: uuid("affiliate_id")
    .notNull()
    .references(() => affiliate.id, { onDelete: "cascade" }),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
});
export const affiliateClick = pgTable("affiliate_click", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateAffiliateClickId()),
  affiliateLinkId: text("affiliate_link_id")
    .notNull()
    .references(() => affiliateLink.id, { onDelete: "cascade" }),
  userAgent: text("user_agent"),
  referrer: text("referrer").default("unknown").notNull(),
  deviceType: text("device_type"),
  browser: text("browser"),
  os: text("os"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const affiliateInvoice = pgTable("affiliate_invoice", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateAffiliatePaymentLinkId()),
  paymentProvider: paymentProviderEnum("payment_provider").notNull(),
  subscriptionId: text("subscription_id"),
  customerId: text("customer_id").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  commission: numeric("commission", { precision: 10, scale: 2 }).notNull(),
  paidAmount: numeric("paid_amount", { precision: 10, scale: 2 })
    .default("0")
    .notNull(),
  affiliateLinkId: text("affiliate_link_id")
    .notNull()
    .references(() => affiliateLink.id, { onDelete: "cascade" }),
  unpaidAmount: numeric("unpaid_amount", { precision: 10, scale: 2 })
    .default("0")
    .notNull(),
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
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateInviteLinkId()),
  email: text("email").notNull(),
  inviterId: uuid("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  organizationId: text("organization_id")
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

    organizationId: text("organization_id")
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
export const organizationDashboardCustomization = pgTable(
  "organization_dashboard_customization",
  {
    id: text("id")
      .primaryKey()
      .references(() => organization.id),
    dashboard: jsonb("dashboard").$type<{
      useSidebarCustomization: {
        sideBarBackgroundColor: string;
        sideBarActiveNavigationTextColor: string;
        sideBarInActiveNavigationTextColor: string;
        sideBarActiveNavigationBackgroundColor: string;
        sideBarHoverNavigationBackgroundColor: string;
        sideBarHoverNavigationTextColor: string;
        sideBarProfileBackgroundColor: string;
        sideBarProfileTextPrimaryColor: string;
        sideBarProfileTextSecondaryColor: string;
        sideBarNavigationFocusRingColor: string;
      };
      useDashboardCardCustomization: {
        dashboardCardShadowThickness: string;
        dashboardCardBorderColor: string;
        dashboardCardBackgroundColor: string;
        dashboardCardShadowColor: string;
        dashboardCardBorder: boolean;
        dashboardCardShadow: boolean;
      };
      useDashboardThemeCustomization: {
        mainBackgroundColor: string;
        separatorColor: string;
        dashboardHeaderNameColor: string;
        dashboardHeaderDescColor: string;
        cardHeaderPrimaryTextColor: string;
        cardHeaderSecondaryTextColor: string;
        dialogHeaderColor: string;
        cardHeaderDescriptionTextColor: string;
      };
      useDashboardButtonCustomization: {
        dashboardButtonBackgroundColor: string;
        dashboardButtonTextColor: string;
        dashboardButtonDisabledBackgroundColor: string;
        dashboardButtonDisabledTextColor: string;
      };
      useTableCustomization: {
        tableHeaderTextColor: string;
        tableHoverBackgroundColor: string;
        tableIconColor: string;
        tableIconHoverColor: string;
        tableIconHoverBackgroundColor: string;
        tableRowPrimaryTextColor: string;
        tableRowSecondaryTextColor: string;
        tableRowTertiaryTextColor: string;
        tableRowBadgeOverDueTextColor: string;
        tableRowBadgeOverDueBackgroundColor: string;
        tableRowBadgePendingTextColor: string;
        tableRowBadgePendingBackgroundColor: string;
        tableRowBadgePaidTextColor: string;
        tableRowBadgePaidBackgroundColor: string;
        tableBorderColor: string;
      };
      useDialogCustomization: {
        dialogBackgroundColor: string;
        dialogCloseIconColor: string;
        dialogCloseIconBorderColor: string;
      };
      useYearSelectCustomization: {
        yearSelectBackgroundColor: string;
        yearSelectTextColor: string;
        yearSelectActiveBorderColor: string;
        yearSelectDropDownBackgroundColor: string;
        yearSelectDropDownTextColor: string;
        yearSelectDropDownActiveTextColor: string;
        yearSelectDropDownActiveBackgroundColor: string;
        yearSelectDropDownIconColor: string;
        yearSelectDropDownHoverBackgroundColor: string;
        yearSelectDropDownHoverTextColor: string;
      };
      useToastCustomization: {
        toastBackgroundColor: string;
        toastTitleColor: string;
        toastDescriptionColor: string;
        toastErrorBackgroundColor: string;
        toastErrorTitleColor: string;
        toastErrorDescriptionColor: string;
      };
      useKpiCardCustomization: {
        cardShadowColor: string;
        cardBorderColor: string;
        cardPrimaryTextColor: string;
        cardSecondaryTextColor: string;
        cardIconPrimaryColor: string;
        cardIconSecondaryColor: string;
        cardIconTertiaryColor: string;
        cardIconPrimaryBackgroundColor: string;
        cardIconSecondaryBackgroundColor: string;
        cardIconTertiaryBackgroundColor: string;
        cardShadowThickness: string;
        cardBackgroundColor: string;
        cardShadow: boolean;
        cardBorder: boolean;
      };
      useChartCustomization: {
        chartHorizontalLineColor: string;
        chartDateColor: string;
        chartPrimaryColor: string;
        chartSecondaryColor: string;
        chartTertiaryColor: string;
        chartLegendTextColor: string;
        toolTipChartDateColor: string;
        toolTipBackgroundColor: string;
        toolTipTextColor: string;
        toolTipNumberColor: string;
      };
      usePieChartColorCustomization: {
        pieColor1: string;
        pieColor2: string;
        pieColor3: string;
        pieColor4: string;
        pieColor5: string;
        pieColor6: string;
        pieColor7: string;
        pieColor8: string;
        pieFallbackColor: string;
      };
    }>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
);
export const organizationAuthCustomization = pgTable(
  "organization_auth_customization",
  {
    id: text("id")
      .primaryKey()
      .references(() => organization.id),
    auth: jsonb("auth").$type<{
      useCardCustomization: {
        cardShadowColor: string;
        cardBorderColor: string;
        cardBackgroundColor: string;
        cardShadowThickness: string;
        cardShadow: boolean;
        cardBorder: boolean;
      };
      useInputCustomization: {
        inputLabelColor: string;
        inputLabelErrorColor: string;
        inputIconColor: string;
        inputTextColor: string;
        inputErrorTextColor: string;
        inputBorderColor: string;
        inputErrorBorderColor: string;
        inputPlaceholderTextColor: string;
        inputBorderFocusColor: string;
      };
      useCheckboxCustomization: {
        checkboxLabelColor: string;
        checkboxActiveColor: string;
        checkboxInactiveColor: string;
      };
      useButtonCustomization: {
        buttonTextColor: string;
        buttonBackgroundColor: string;
        buttonDisabledTextColor: string;
        buttonDisabledBackgroundColor: string;
      };
      useThemeCustomization: {
        backgroundColor: string;
        linkTextColor: string;
        tertiaryTextColor: string;
        primaryCustomization: string;
        secondaryCustomization: string;
        InvalidPrimaryCustomization: string;
        InvalidSecondaryCustomization: string;
        emailVerifiedPrimaryColor: string;
        emailVerifiedSecondaryColor: string;
        emailVerifiedIconColor: string;
      };
    }>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
);
