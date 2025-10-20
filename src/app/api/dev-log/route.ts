import { NextResponse } from "next/server"

// 🎨 Colors (ANSI escape codes)
const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  fgRed: "\x1b[31m",
  fgYellow: "\x1b[33m",
  fgVibrantBlue: "\x1b[94m", // bright blue
  fgPurple: "\x1b[95m", // magenta / purple
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ ok: false })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid or empty JSON" })
  }

  const { type, message } = body
  const tag = type?.toUpperCase?.() ?? "LOG"

  // ✅ Pick color by type
  const color =
    type === "error"
      ? COLORS.fgRed
      : type === "warn"
        ? COLORS.fgYellow
        : COLORS.fgPurple // or COLORS.fgVibrantBlue for blue

  const formatted = `${color}${COLORS.bright}[CLIENT ${tag}]${COLORS.reset} ${message}`

  // Log in color
  if (type === "error") console.error(formatted)
  else if (type === "warn") console.warn(formatted)
  else console.log(formatted)

  return NextResponse.json({ ok: true })
}
