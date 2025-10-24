import { atom } from "jotai"

export const previewSimulationAtom = atom<
  "none" | "loading" | "error" | "empty"
>("none")
