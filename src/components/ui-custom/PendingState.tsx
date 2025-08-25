import React from "react"
import { Loader2 } from "lucide-react"

type PendingStateProps = {
  withoutBackground?: boolean
}

const PendingState = ({ withoutBackground }: PendingStateProps) => {
  return (
    <div
      className={`flex justify-center items-center h-screen ${
        withoutBackground ? "" : "bg-white"
      }`}
    >
      <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
    </div>
  )
}

export default PendingState
