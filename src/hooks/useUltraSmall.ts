import { useState, useEffect } from "react"

export function useUltraSmall() {
  const [isUltraSmall, setIsUltraSmall] = useState(false)

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth
      setIsUltraSmall(width >= 320 && width <= 375)
    }

    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return isUltraSmall
}
