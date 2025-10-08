"use client"

import { useMemo } from "react"
import throttle from "lodash/throttle"
import type { SetStateAction } from "jotai"

export function useThrottledOptionsUpdater<T extends Record<string, unknown>>(
  setAtom: (update: SetStateAction<T>) => void,
  wait = 300
) {
  return useMemo(() => {
    const cache = {} as Record<keyof T, (val: T[keyof T]) => void>

    return new Proxy(cache, {
      get(_, prop: string) {
        const key = prop as keyof T

        if (!cache[key]) {
          cache[key] = throttle(
            (val: T[keyof T]) =>
              setAtom((prev) => ({
                ...prev,
                [key]: val,
              })),
            wait,
            { leading: true, trailing: true }
          )
        }

        return cache[key]
      },
    }) as Record<keyof T, (val: T[keyof T]) => void>
  }, [setAtom, wait])
}
