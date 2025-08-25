import { AuthCustomizationStores } from "@/store/useCustomizationStore"

export const useCardCustomizationOption = () => {
  const cardShadowThickness = AuthCustomizationStores.useCardCustomization(
    (s) => s.cardShadowThickness
  )
  const cardShadowColor = AuthCustomizationStores.useCardCustomization(
    (s) => s.cardShadowColor
  )
  const cardBorderColor = AuthCustomizationStores.useCardCustomization(
    (s) => s.cardBorderColor
  )
  const cardBackgroundColor = AuthCustomizationStores.useCardCustomization(
    (s) => s.cardBackgroundColor
  )
  const cardShadow = AuthCustomizationStores.useCardCustomization(
    (s) => s.cardShadow
  )
  const cardBorder = AuthCustomizationStores.useCardCustomization(
    (s) => s.cardBorder
  )
  const setCardColor = AuthCustomizationStores.useCardCustomization(
    (s) => s.setColor
  )
  const setCardSwitch = AuthCustomizationStores.useCardCustomization(
    (s) => s.setSwitch
  )

  return {
    cardShadowThickness,
    cardShadowColor,
    cardBorderColor,
    cardBackgroundColor,
    cardShadow,
    cardBorder,
    setCardColor,
    setCardSwitch,
  }
}
export const useInputCustomizationOption = () => {
  const inputLabelColor = AuthCustomizationStores.useInputCustomization(
    (s) => s.inputLabelColor
  )
  const inputLabelErrorColor = AuthCustomizationStores.useInputCustomization(
    (s) => s.inputLabelErrorColor
  )
  const inputIconColor = AuthCustomizationStores.useInputCustomization(
    (s) => s.inputIconColor
  )
  const inputTextColor = AuthCustomizationStores.useInputCustomization(
    (s) => s.inputTextColor
  )
  const inputErrorTextColor = AuthCustomizationStores.useInputCustomization(
    (s) => s.inputErrorTextColor
  )
  const inputBorderColor = AuthCustomizationStores.useInputCustomization(
    (s) => s.inputBorderColor
  )
  const inputBorderFocusColor = AuthCustomizationStores.useInputCustomization(
    (s) => s.inputBorderFocusColor
  )
  const inputErrorBorderColor = AuthCustomizationStores.useInputCustomization(
    (s) => s.inputErrorBorderColor
  )
  const inputPlaceholderTextColor =
    AuthCustomizationStores.useInputCustomization(
      (s) => s.inputPlaceholderTextColor
    )

  const setColor = AuthCustomizationStores.useInputCustomization(
    (s) => s.setColor
  )

  return {
    inputLabelColor,
    inputLabelErrorColor,
    inputIconColor,
    inputTextColor,
    inputBorderFocusColor,
    inputErrorTextColor,
    inputBorderColor,
    inputErrorBorderColor,
    inputPlaceholderTextColor,
    setColor,
  }
}
export const useCheckboxCustomizationOption = () => {
  const checkboxLabelColor = AuthCustomizationStores.useCheckboxCustomization(
    (s) => s.checkboxLabelColor
  )
  const checkboxActiveColor = AuthCustomizationStores.useCheckboxCustomization(
    (s) => s.checkboxActiveColor
  )
  const checkboxInactiveColor =
    AuthCustomizationStores.useCheckboxCustomization(
      (s) => s.checkboxInactiveColor
    )
  const setCheckboxColor = AuthCustomizationStores.useCheckboxCustomization(
    (s) => s.setColor
  )

  return {
    checkboxLabelColor,
    checkboxActiveColor,
    checkboxInactiveColor,
    setCheckboxColor,
  }
}
export const useButtonCustomizationOption = () => {
  const buttonTextColor = AuthCustomizationStores.useButtonCustomization(
    (s) => s.buttonTextColor
  )
  const buttonBackgroundColor = AuthCustomizationStores.useButtonCustomization(
    (s) => s.buttonBackgroundColor
  )
  const buttonDisabledTextColor =
    AuthCustomizationStores.useButtonCustomization(
      (s) => s.buttonDisabledTextColor
    )
  const buttonDisabledBackgroundColor =
    AuthCustomizationStores.useButtonCustomization(
      (s) => s.buttonDisabledBackgroundColor
    )
  const setButtonColor = AuthCustomizationStores.useButtonCustomization(
    (s) => s.setColor
  )

  return {
    buttonTextColor,
    buttonBackgroundColor,
    buttonDisabledTextColor,
    buttonDisabledBackgroundColor,
    setButtonColor,
  }
}
export const useThemeCustomizationOption = () => {
  const backgroundColor = AuthCustomizationStores.useThemeCustomization(
    (s) => s.backgroundColor
  )
  const linkTextColor = AuthCustomizationStores.useThemeCustomization(
    (s) => s.linkTextColor
  )
  const tertiaryTextColor = AuthCustomizationStores.useThemeCustomization(
    (s) => s.tertiaryTextColor
  )
  const primaryCustomization = AuthCustomizationStores.useThemeCustomization(
    (s) => s.primaryCustomization
  )
  const secondaryCustomization = AuthCustomizationStores.useThemeCustomization(
    (s) => s.secondaryCustomization
  )
  const InvalidPrimaryCustomization =
    AuthCustomizationStores.useThemeCustomization(
      (s) => s.InvalidPrimaryCustomization
    )
  const InvalidSecondaryCustomization =
    AuthCustomizationStores.useThemeCustomization(
      (s) => s.InvalidSecondaryCustomization
    )
  const emailVerifiedPrimaryColor =
    AuthCustomizationStores.useThemeCustomization(
      (s) => s.emailVerifiedPrimaryColor
    )
  const emailVerifiedSecondaryColor =
    AuthCustomizationStores.useThemeCustomization(
      (s) => s.emailVerifiedSecondaryColor
    )
  const emailVerifiedIconColor = AuthCustomizationStores.useThemeCustomization(
    (s) => s.emailVerifiedIconColor
  )
  const setThemeColor = AuthCustomizationStores.useThemeCustomization(
    (s) => s.setColor
  )

  return {
    backgroundColor,
    linkTextColor,
    tertiaryTextColor,
    primaryCustomization,
    secondaryCustomization,
    InvalidPrimaryCustomization,
    InvalidSecondaryCustomization,
    emailVerifiedPrimaryColor,
    emailVerifiedSecondaryColor,
    emailVerifiedIconColor,
    setThemeColor,
  }
}
export const useNotesCustomizationOption = (): {
  customNotesLogin: string
  customNotesSignup: string
  setNote: (key: string, value: string) => void
} => {
  const customNotesLogin = AuthCustomizationStores.useNotesCustomization(
    (s) => s.customNotesLogin
  )
  const customNotesSignup = AuthCustomizationStores.useNotesCustomization(
    (s) => s.customNotesSignup
  )

  const setNote = AuthCustomizationStores.useNotesCustomization(
    (s) => s.setNote
  )

  return {
    customNotesLogin,
    customNotesSignup,
    setNote,
  }
}
