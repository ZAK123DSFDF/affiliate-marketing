export function bridgeConsoleToServer() {
  // Only run in development
  if (process.env.NODE_ENV !== "development") return

  const originalLog = console.log
  const originalError = console.error
  const originalWarn = console.warn

  console.log = (...args) => {
    originalLog(...args) // still show in browser console
    sendToServer("log", args)
  }

  console.error = (...args) => {
    originalError(...args)
    sendToServer("error", args)
  }

  console.warn = (...args) => {
    originalWarn(...args)
    sendToServer("warn", args)
  }

  function sendToServer(type: string, args: any[]) {
    try {
      fetch("/api/dev-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message: args.map(String).join(" "),
        }),
      }).catch((err) => {
        // Only use the *original* console methods to avoid recursion
        originalError("Failed to send log to server:", err)
      })
    } catch (err) {
      originalError("Console bridge internal error:", err)
    }
  }
}
