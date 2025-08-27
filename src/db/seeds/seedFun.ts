const {
  affiliateClick_seed,
  affiliateInvoice_seed,
  affiliateLink_seed,
  affiliate_seed,
  organizationAuthCustomization_seed,
  organizationDashboardCustomization_seed,
  organization_seed,
  userOrganization_seed,
  user_seed,
  //@ts-ignore
} = await import("@/db/seeds/databaseObjects")

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

async function seedFun() {
  await db.insert(organization).values(organization_seed)
  await db.insert(user).values(user_seed)
  await db.insert(userToOrganization).values(userOrganization_seed)
  await db.insert(affiliate).values(affiliate_seed)
  await db.insert(affiliateLink).values(affiliateLink_seed)
  await db.insert(affiliateClick).values(affiliateClick_seed)
  await db.insert(affiliateInvoice).values(affiliateInvoice_seed)
  await db
    .insert(organizationAuthCustomization)
    .values(organizationAuthCustomization_seed)
  await db
    .insert(organizationDashboardCustomization)
    .values(organizationDashboardCustomization_seed)
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
