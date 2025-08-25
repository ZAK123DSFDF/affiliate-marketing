export type CustomizationConfig = {
  booleans?: string[]
  notes?: string[]
}

export const customizationConfig: Record<string, CustomizationConfig> = {
  useCardCustomization: {
    booleans: ["cardShadow", "cardBorder"],
  },
  useNotesCustomization: {
    notes: ["customNotesLogin", "customNotesSignup"],
  },
  useDashboardCardCustomization: {
    booleans: ["dashboardCardBorder", "dashboardCardShadow"],
  },
  useKpiCardCustomization: {
    booleans: ["cardShadow", "cardBorder"],
  },
}
