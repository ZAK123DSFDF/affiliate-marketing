import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"

const Disconnect = () => {
  return (
    <>
      <h3 className="text-xl font-semibold mb-4">Disconnect Paddle</h3>
      <Card>
        <CardHeader className="font-semibold">
          Remove Webhook Connection
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
            Once deactivated, Paddle will no longer send data to our servers.
            You can reconnect anytime by following steps 1–4 above.
          </p>
        </CardContent>
      </Card>
    </>
  )
}
export default Disconnect
