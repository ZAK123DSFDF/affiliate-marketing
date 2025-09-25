"use server"

import { db } from "@/db/drizzle"
import {
  organizationAuthCustomization,
  organizationDashboardCustomization,
} from "@/db/schema"

import { eq } from "drizzle-orm"
import { defaultAuthCustomization } from "@/customization/Auth/defaultAuthCustomization"
import { defaultDashboardCustomization } from "@/customization/Dashboard/defaultDashboardCustomization"
import { deepMerge } from "@/util/DeepMerge"

export type AuthCustomization = typeof defaultAuthCustomization
export type DashboardCustomization = typeof defaultDashboardCustomization

export async function saveCustomizationsAction(
  orgId: string,
  data: {
    auth?: Partial<AuthCustomization>
    dashboard?: Partial<DashboardCustomization>
  }
) {
  // Quick guard
  if (
    (!data.auth || Object.keys(data.auth).length === 0) &&
    (!data.dashboard || Object.keys(data.dashboard).length === 0)
  ) {
    return { success: true, message: "no changes" }
  }

  // ---- AUTH ----
  if (data.auth && Object.keys(data.auth).length > 0) {
    // fetch existing auth row (if any)
    const rows = await db
      .select({ auth: organizationAuthCustomization.auth })
      .from(organizationAuthCustomization)
      .where(eq(organizationAuthCustomization.id, orgId))

    if (rows.length === 0) {
      // create full object by merging defaults + patch, then insert
      const authToInsert = deepMerge(defaultAuthCustomization, data.auth)
      await db.insert(organizationAuthCustomization).values({
        id: orgId,
        auth: authToInsert,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    } else {
      const existingAuth = rows[0].auth as AuthCustomization
      const merged = deepMerge(existingAuth, data.auth)
      await db
        .update(organizationAuthCustomization)
        .set({ auth: merged, updatedAt: new Date() })
        .where(eq(organizationAuthCustomization.id, orgId))
    }
  }

  // ---- DASHBOARD ----
  if (data.dashboard && Object.keys(data.dashboard).length > 0) {
    const rows = await db
      .select({ dashboard: organizationDashboardCustomization.dashboard })
      .from(organizationDashboardCustomization)
      .where(eq(organizationDashboardCustomization.id, orgId))

    if (rows.length === 0) {
      const dashboardToInsert = deepMerge(
        defaultDashboardCustomization,
        data.dashboard
      )
      await db.insert(organizationDashboardCustomization).values({
        id: orgId,
        dashboard: dashboardToInsert,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    } else {
      const existingDashboard = rows[0].dashboard as DashboardCustomization
      const merged = deepMerge(existingDashboard, data.dashboard)
      await db
        .update(organizationDashboardCustomization)
        .set({ dashboard: merged, updatedAt: new Date() })
        .where(eq(organizationDashboardCustomization.id, orgId))
    }
  }

  return { success: true }
}
export async function getAuthCustomization(
  orgId: string
): Promise<AuthCustomization> {
  const [authRow] = await db
    .select({ auth: organizationAuthCustomization.auth })
    .from(organizationAuthCustomization)
    .where(eq(organizationAuthCustomization.id, orgId))

  return authRow?.auth as AuthCustomization
}

export async function getDashboardCustomization(
  orgId: string
): Promise<DashboardCustomization> {
  const [dashboardRow] = await db
    .select({ dashboard: organizationDashboardCustomization.dashboard })
    .from(organizationDashboardCustomization)
    .where(eq(organizationDashboardCustomization.id, orgId))

  return dashboardRow?.dashboard as DashboardCustomization
}
export async function getCustomizations(
  orgId: string
): Promise<{ auth: AuthCustomization; dashboard: DashboardCustomization }> {
  const [auth, dashboard] = await Promise.all([
    getAuthCustomization(orgId),
    getDashboardCustomization(orgId),
  ])

  return { auth, dashboard }
}
