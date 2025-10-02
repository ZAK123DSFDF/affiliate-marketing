"use client"

import { Button } from "@/components/ui/button"

type GoogleButtonProps = {
  affiliate: boolean
  orgId: string
  rememberMe?: boolean
}

export function GoogleButton({
  affiliate,
  orgId,
  rememberMe = false,
}: GoogleButtonProps) {
  const type = affiliate ? "affiliate" : "seller"
  const handleClick = () => {
    window.location.href = `/api/auth/google?type=${type}&orgId=${orgId}&rememberMe=${rememberMe}`
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      className="w-full flex items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="w-5 h-5"
      >
        <path
          fill="#4285F4"
          d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 .9 8.3 2.9l6.3-6.3C35.5 4.9 30 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.9 0 20-7.9 20-21 0-1.3-.1-2.2-.5-4z"
        />
        <path fill="none" d="M0 0h48v48H0z" />
      </svg>
      Continue with Google
    </Button>
  )
}
