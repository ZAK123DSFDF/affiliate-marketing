// scripts/seedOrgCustomizations.ts
import { db } from "@/db/drizzle";
import {
  organizationDashboardCustomization,
  organizationAuthCustomization,
} from "@/db/schema";
import { defaultAuthCustomization } from "@/customization/Auth/defaultAuthCustomization";
import { defaultDashboardCustomization } from "@/customization/Dashboard/defaultDashboardCustomization";

async function seedOrgCustomizations(orgId: string) {
  await db.insert(organizationDashboardCustomization).values({
    id: orgId,
    dashboard: defaultDashboardCustomization,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.insert(organizationAuthCustomization).values({
    id: orgId,
    auth: defaultAuthCustomization,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

// 👇 Auto-run
try {
  await seedOrgCustomizations("tp7JLBb5");
  console.log("✅ Customization seed completed successfully");
  process.exit(0);
} catch (err) {
  console.error("❌ Error seeding customization:", err);
  process.exit(1);
}
