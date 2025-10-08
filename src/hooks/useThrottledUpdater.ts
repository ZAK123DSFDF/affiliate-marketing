"use client"

import { useMemo } from "react"
import throttle from "lodash/throttle"
import type { SetStateAction } from "jotai"

export function useThrottledUpdater<T extends Record<string, unknown>>(
  setAtom: (update: SetStateAction<T>) => void,
  wait = 300
) {
  return useMemo(() => {
    const throttledCache = {} as Record<keyof T, (val: T[keyof T]) => void>

    return new Proxy(throttledCache, {
      get(_, prop: string) {
        const key = prop as keyof T

        if (!throttledCache[key]) {
          throttledCache[key] = throttle(
            (val: T[keyof T]) =>
              setAtom((prev) => ({
                ...prev,
                [key]: val,
              })),
            wait,
            { leading: true, trailing: true }
          )
        }
        return throttledCache[key]
      },
    }) as Record<keyof T, (val: T[keyof T]) => void>
  }, [setAtom, wait])
}
