"use server"

import { db } from "@/db/drizzle"
import { invitation, team } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { sendEmail } from "@/lib/email"
import { handleAction } from "@/lib/handleAction"

export const inviteTeamMember = async ({
  email,
  title,
  description,
  orgId,
}: {
  email: string
  title: string
  description: string
  orgId: string
}) => {
  return handleAction("Invite Team Member", async () => {
    if (!email || !title || !description || !orgId) {
      throw {
        status: 400,
        error: "Missing required fields.",
        toast: "Please fill in all required fields.",
        fields: {
          email: !email ? "Email is required" : "",
          title: !title ? "Title is required" : "",
          description: !description ? "Description is required" : "",
          orgId: !orgId ? "Organization is required" : "",
        },
      }
    }

    // Check if this email is already invited
    const existingTeamMember = await db.query.team.findFirst({
      where: and(eq(team.email, email), eq(team.organizationId, orgId)),
    })

    if (existingTeamMember) {
      throw {
        status: 409,
        error: "This email is already a team member.",
        toast: "This user is already part of your team.",
        fields: { email: "Already a team member" },
      }
    }
    const [invite] = await db
      .insert(invitation)
      .values({
        email,
        organizationId: orgId,
        title,
        body: description,
      })
      .returning()

    // Construct invite link using the generated token
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/signup?teamToken=${invite.token}`
    const subject = `Team Invitation: ${title}`
    const text = `${description}\n\nJoin your team here:\n${inviteLink}`

    if (process.env.NODE_ENV === "development") {
      const sent = await sendEmail({
        to: email,
        subject,
        text,
      })

      if (!sent.success) {
        throw {
          status: 500,
          error: "Failed to send invitation email (dev).",
          toast: sent.message || "Could not send the invitation email.",
        }
      }
    } else {
      throw {
        status: 500,
        error: "Email sending not configured for production.",
        toast: "Email sending is not set up for production environment.",
      }
    }

    return {
      ok: true,
      toast: "Invitation sent successfully.",
    }
  })
}
