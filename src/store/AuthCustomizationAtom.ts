"use client"

import { atom } from "jotai"
import { defaultAuthCustomization } from "@/customization/Auth/defaultAuthCustomization"

// infer types directly from slices of defaultAuthCustomization
export type CardCustomization =
  typeof defaultAuthCustomization.useCardCustomization
export type InputCustomization =
  typeof defaultAuthCustomization.useInputCustomization
export type CheckboxCustomization =
  typeof defaultAuthCustomization.useCheckboxCustomization
export type ButtonCustomization =
  typeof defaultAuthCustomization.useButtonCustomization
export type ThemeCustomization =
  typeof defaultAuthCustomization.useThemeCustomization
export type NotesCustomization =
  typeof defaultAuthCustomization.useNotesCustomization

// atoms for each slice, fully typed
export const cardCustomizationAtom = atom<CardCustomization>(
  defaultAuthCustomization.useCardCustomization
)

export const inputCustomizationAtom = atom<InputCustomization>(
  defaultAuthCustomization.useInputCustomization
)

export const checkboxCustomizationAtom = atom<CheckboxCustomization>(
  defaultAuthCustomization.useCheckboxCustomization
)

export const buttonCustomizationAtom = atom<ButtonCustomization>(
  defaultAuthCustomization.useButtonCustomization
)

export const themeCustomizationAtom = atom<ThemeCustomization>(
  defaultAuthCustomization.useThemeCustomization
)

export const notesCustomizationAtom = atom<NotesCustomization>(
  defaultAuthCustomization.useNotesCustomization
)
