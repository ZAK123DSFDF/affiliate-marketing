import { db } from "@/db/drizzle"
import {
  user,
  organization,
  affiliate,
  affiliateLink,
  affiliateClick,
  affiliateInvoice,
  userToOrganization,
  organizationAuthCustomization,
  organizationDashboardCustomization,
} from "@/db/schema"
import {
  affiliate_click_seed,
  affiliate_invoice_seed,
  affiliate_link_seed,
  affiliate_seed,
  organization_auth_customization_seed,
  organization_dashboard_customization_seed,
  organization_seed,
  user_organization_seed,
  user_seed,
} from "@/db/seeds/databaseSeed"

async function seedFun() {
  await db.insert(organization).values(organization_seed)
  await db.insert(user).values(user_seed)
  await db.insert(userToOrganization).values(user_organization_seed)
  await db.insert(affiliate).values(affiliate_seed)
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
    console.log("✅ Seed completed")
    process.exit(0)
  })
  .catch((err) => {
    console.error("❌ Seed failed", err)
    process.exit(1)
  })
