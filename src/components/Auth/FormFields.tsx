"use client"
import { Eye, EyeOff } from "lucide-react"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { useAtomValue } from "jotai"
import {
  cardCustomizationAtom,
  checkboxCustomizationAtom,
  inputCustomizationAtom,
} from "@/store/AuthCustomizationAtom"

type InputFieldProps = {
  control: any
  name: string
  label: string
  placeholder: string
  type: "email" | "password" | "text" | "number"
  icon?: React.ElementType
  showPasswordToggle?: boolean
  profile?: boolean
  affiliate: boolean
  disabled?: boolean
}

export const InputField = ({
  control,
  name,
  label,
  placeholder,
  type,
  icon,
  showPasswordToggle = false,
  profile = false,
  affiliate,
  disabled = false,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const Icon = icon
  const {
    inputBorderColor,
    inputErrorBorderColor,
    inputErrorTextColor,
    inputIconColor,
    inputPlaceholderTextColor,
    inputLabelColor,
    inputBorderFocusColor,
    inputLabelErrorColor,
    inputTextColor,
  } = useAtomValue(inputCustomizationAtom)
  const { cardBackgroundColor } = useAtomValue(cardCustomizationAtom)
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel
            className={fieldState.error ? "text-destructive" : ""}
            style={{
              color: fieldState.error
                ? (affiliate && inputLabelErrorColor) || undefined
                : (affiliate && inputLabelColor) || undefined,
            }}
          >
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              {Icon && (
                <Icon
                  className={`absolute left-3 top-2.5 h-5 w-5 text-muted-foreground ${
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  style={{
                    color: disabled
                      ? "#9ca3af"
                      : (affiliate && inputIconColor) || undefined,
                  }}
                />
              )}
              <Input
                type={showPasswordToggle && showPassword ? "text" : type}
                placeholder={placeholder}
                disabled={disabled}
                className={`auth-input-placeholder border ${
                  icon ? "pl-10" : ""
                } ${profile ? "w-[280px]" : "w-full"} ${
                  fieldState.error
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                style={{
                  color: fieldState.error
                    ? (affiliate && inputErrorTextColor) || undefined
                    : (affiliate && inputTextColor) || undefined,
                  borderColor: fieldState.error
                    ? (affiliate && inputErrorBorderColor) || undefined
                    : (affiliate && inputBorderColor) || undefined,
                }}
                {...field}
              />

              <style>{`
                 .auth-input-placeholder::placeholder {
                      color: ${(affiliate && inputPlaceholderTextColor) || undefined} !important;
                          }
                  input:focus.auth-input-placeholder {
                      outline: none !important;
                      border-color: ${(affiliate && inputBorderFocusColor) || undefined} !important;
                      box-shadow: 0 0 0 1px ${(affiliate && inputBorderFocusColor) || undefined} !important;
                           }
                     input.auth-input-placeholder:-webkit-autofill {
                         box-shadow: 0 0 0px 1000px ${(affiliate && cardBackgroundColor) || undefined} inset !important;
                         -webkit-box-shadow: 0 0 0px 1000px ${(affiliate && cardBackgroundColor) || undefined} inset !important;
                         -webkit-text-fill-color: ${(affiliate && inputTextColor) || undefined} !important;
                          transition: background-color 9999s ease-in-out 0s;
                            }
                  `}</style>
              {showPasswordToggle && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  style={{ color: (affiliate && inputIconColor) || undefined }}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
          </FormControl>
          {fieldState.error && (
            <div
              style={{
                color: (affiliate && inputLabelErrorColor) || "red",
                fontSize: "0.875rem",
                fontWeight: 500,
                marginTop: "0.25rem",
              }}
            >
              {fieldState.error.message}
            </div>
          )}
        </FormItem>
      )}
    />
  )
}

type CheckboxFieldProps = {
  control: any
  name: string
  label: string
  affiliate?: boolean
}

export const CheckboxField = ({
  control,
  name,
  label,
  affiliate,
}: CheckboxFieldProps) => {
  const { checkboxActiveColor, checkboxInactiveColor, checkboxLabelColor } =
    useAtomValue(checkboxCustomizationAtom)
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <div className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-2 rounded"
                  style={{
                    borderColor: field.value
                      ? (affiliate && checkboxActiveColor) || undefined
                      : (affiliate && checkboxInactiveColor) || undefined,
                    backgroundColor: field.value
                      ? (affiliate && checkboxActiveColor) || undefined
                      : "transparent",
                  }}
                />
              </FormControl>
              <FormLabel
                className="!mt-0 cursor-pointer"
                style={{
                  color: (affiliate && checkboxLabelColor) || undefined,
                }}
              >
                {label}
              </FormLabel>
            </div>
          </FormItem>
        )
      }}
    />
  )
}
