import { db } from "@/db/drizzle"
import {
  user,
  organization,
  affiliate,
  affiliateLink,
  affiliateClick,
  affiliateInvoice,
  organizationAuthCustomization,
  organizationDashboardCustomization,
  account,
  affiliateAccount,
  websiteDomain,
} from "@/db/schema"
import {
  account_seed,
  affiliate_account_seed,
  affiliate_click_seed,
  affiliate_invoice_seed,
  affiliate_link_seed,
  affiliate_seed,
  organization_auth_customization_seed,
  organization_dashboard_customization_seed,
  organization_seed,
  user_seed,
  websiteDomain_seed,
} from "@/db/seeds/databaseSeed"

async function seedFun() {
  await db.insert(user).values(user_seed)
  await db.insert(account).values(account_seed)
  await db.insert(organization).values(organization_seed)
  await db.insert(websiteDomain).values(websiteDomain_seed)
  await db.insert(affiliate).values(affiliate_seed)
  await db.insert(affiliateAccount).values(affiliate_account_seed)
  await db.insert(affiliateLink).values(affiliate_link_seed)
  await db.insert(affiliateClick).values(affiliate_click_seed)
  await db.insert(affiliateInvoice).values(affiliate_invoice_seed)
  await db
    .insert(organizationAuthCustomization)
    .values(organization_auth_customization_seed)
  await db
    .insert(organizationDashboardCustomization)
    .values(organization_dashboard_customization_seed)
}

seedFun()
  .then(() => {
    console.log("✅ Auto-seed completed")
    process.exit(0)
  })
  .catch((err) => {
    console.error("❌ Auto-seed failed", err)
    process.exit(1)
  })
