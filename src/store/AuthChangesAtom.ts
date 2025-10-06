"use client"

import { atom } from "jotai"
import equal from "fast-deep-equal"
import {
  ButtonCustomization,
  buttonCustomizationAtom,
  CardCustomization,
  cardCustomizationAtom,
  CheckboxCustomization,
  checkboxCustomizationAtom,
  GoogleButtonCustomization,
  googleButtonCustomizationAtom,
  InputCustomization,
  inputCustomizationAtom,
  NotesCustomization,
  notesCustomizationAtom,
  ThemeCustomization,
  themeCustomizationAtom,
} from "@/store/AuthCustomizationAtom"

// Initial values (fetched from DB and set in sync hooks)
export const initialCardCustomizationAtom = atom<CardCustomization | null>(null)
export const initialInputCustomizationAtom = atom<InputCustomization | null>(
  null
)
export const initialCheckboxCustomizationAtom =
  atom<CheckboxCustomization | null>(null)
export const initialButtonCustomizationAtom = atom<ButtonCustomization | null>(
  null
)
export const initialThemeCustomizationAtom = atom<ThemeCustomization | null>(
  null
)
export const initialGoogleButtonCustomizationAtom =
  atom<GoogleButtonCustomization | null>(null)
export const initialNotesCustomizationAtom = atom<NotesCustomization | null>(
  null
)

// Derived atom: true if *any* auth customization differs
export const authHasChangesAtom = atom((get) => {
  const pairs: [any, any][] = [
    [get(cardCustomizationAtom), get(initialCardCustomizationAtom)],
    [get(inputCustomizationAtom), get(initialInputCustomizationAtom)],
    [get(checkboxCustomizationAtom), get(initialCheckboxCustomizationAtom)],
    [get(buttonCustomizationAtom), get(initialButtonCustomizationAtom)],
    [get(themeCustomizationAtom), get(initialThemeCustomizationAtom)],
    [
      get(googleButtonCustomizationAtom),
      get(initialGoogleButtonCustomizationAtom),
    ],
    [get(notesCustomizationAtom), get(initialNotesCustomizationAtom)],
  ]

  return pairs.some(
    ([current, initial]) => initial !== null && !equal(current, initial)
  )
})
