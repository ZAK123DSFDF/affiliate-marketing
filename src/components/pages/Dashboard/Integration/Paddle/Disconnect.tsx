"use client"

import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"
import Image from "next/image"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  deleteOrgPaddleAccount,
  getOrgWebhookKey,
} from "@/app/(seller)/seller/[orgId]/dashboard/integration/action"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"

interface DisconnectProps {
  orgId: string
}

const Disconnect = ({ orgId }: DisconnectProps) => {
  const { showCustomToast } = useCustomToast()
  const queryClient = useQueryClient()

  // Fetch webhook key
  const { data, isPending } = useQuery({
    queryKey: ["paddle-webhook-key", orgId],
    queryFn: async () => await getOrgWebhookKey(orgId),
  })

  const savedKey = data?.webhookPublicKey ?? ""

  // Mutation for disconnecting Paddle account
  const disconnectMutation = useMutation({
    mutationFn: async () => await deleteOrgPaddleAccount(orgId),
    onSuccess: () => {
      showCustomToast({
        type: "success",
        title: "Disconnected successfully",
        description: "Paddle account has been removed from this organization.",
        affiliate: false,
      })
      queryClient
        .invalidateQueries({
          queryKey: ["paddle-webhook-key", orgId],
        })
        .then(() => console.log("Invalidated"))
    },
    onError: (error: any) => {
      showCustomToast({
        type: "error",
        title: "Failed to disconnect",
        description: error?.toast || "An unexpected error occurred.",
        affiliate: false,
      })
    },
  })

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
