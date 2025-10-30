"use client"

import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"
import Image from "next/image"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  deleteOrgPaddleAccount,
  getOrgWebhookKey,
} from "@/app/(organization)/organization/[orgId]/dashboard/integration/action"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"
import { AppResponse, useAppMutation } from "@/hooks/useAppMutation"
import {
  deleteTeamOrgPaddleAccount,
  getTeamOrgWebhookKey,
} from "@/app/(organization)/organization/[orgId]/teams/dashboard/integration/action"

interface DisconnectProps {
  orgId: string
  isTeam?: boolean
}

const Disconnect = ({ orgId, isTeam = false }: DisconnectProps) => {
  const { showCustomToast } = useCustomToast()
  const queryClient = useQueryClient()
  const deleteFn = isTeam ? deleteTeamOrgPaddleAccount : deleteOrgPaddleAccount
  const getFn = isTeam ? getTeamOrgWebhookKey : getOrgWebhookKey
  // Fetch webhook key
  const { data, isPending } = useQuery({
    queryKey: ["paddle-webhook-key", orgId],
    queryFn: async () => await getFn(orgId),
  })

  const savedKey = data?.webhookPublicKey ?? ""

  // Mutation for disconnecting Paddle account
  const disconnectMutation = useAppMutation<AppResponse, void>(
    async () => await deleteFn(orgId),
    {
      affiliate: false, // 👈 same as before
      onSuccess: (res) => {
        if (res.ok) {
          queryClient
            .invalidateQueries({
              queryKey: ["paddle-webhook-key", orgId],
            })
            .then(() => console.log("Invalidated"))
        }
      },
    }
  )

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <h3 className="text-xl font-semibold mb-4">Disconnect Paddle</h3>
      <Card>
        <CardHeader className="font-semibold">
          Disconnect Paddle Integration
        </CardHeader>
        <CardContent className="space-y-4">
          <p>To stop sending data to our platform:</p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>
              Go to <strong>Developer Tools → Notifications</strong>.
            </li>
            <li>Find the destination you previously connected.</li>
            <li>
              Click the <strong>⋮</strong> (three-dot menu) on the right.
            </li>
            <li>
              Select <strong>Deactivate</strong>.
            </li>
          </ul>
          <Image
            src="/images/paddle/paddle-5.png"
            alt="Deactivate Paddle Webhook"
            width={800}
            height={400}
            className="rounded-xl border"
          />
          <p className="text-muted-foreground text-sm">
            After deactivating your webhook in Paddle, click the button below to
            remove your Paddle connection from our system.
          </p>

          <Button
            variant="destructive"
            className="w-full"
            onClick={() => disconnectMutation.mutate()}
            disabled={!savedKey || disconnectMutation.isPending}
          >
            {disconnectMutation.isPending ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Disconnecting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Disconnect
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </>
  )
}

export default Disconnect
