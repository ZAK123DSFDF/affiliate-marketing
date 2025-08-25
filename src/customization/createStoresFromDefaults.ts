import { CustomizationConfig } from "@/customization/customizationConfig"
import { createCustomizationStore } from "@/store/CreateCustomizationStore"

export function createStoresFromDefaults<
  T extends Record<string, Record<string, any>>,
>(defaults: T, config: Record<string, CustomizationConfig>) {
  return Object.fromEntries(
    Object.entries(defaults).map(([storeName, values]) => {
      const { booleans = [], notes = [] } = config[storeName] || {}
      const colors: Record<string, string> = {}
      const switches: Record<string, boolean> = {}
      const customNotes: Record<string, string> = {}

      for (const [prop, val] of Object.entries(values)) {
        if (booleans.includes(prop)) {
          switches[prop] = val as boolean
        } else if (notes.includes(prop)) {
          customNotes[prop] = val as string
        } else {
          colors[prop] = val as string
        }
      }

      return [
        storeName,
        createCustomizationStore<
          typeof colors,
          typeof switches,
          typeof customNotes
        >(colors, switches, customNotes),
      ]
    })
  ) as {
    [K in keyof T]: ReturnType<
      typeof createCustomizationStore<
        Record<string, string>,
        Record<string, boolean>,
        Record<string, string>
      >
    >
  }
}
