"use client";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { AuthCustomizationSettings } from "@/lib/types/authCustomizationSettings";

type InputFieldProps = {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  type: "email" | "password" | "text";
  icon?: React.ElementType;
  showPasswordToggle?: boolean;
  customization?: AuthCustomizationSettings;
};

export const InputField = ({
  control,
  name,
  label,
  placeholder,
  type,
  icon,
  showPasswordToggle = false,
  customization,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const Icon = icon;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel
            style={{
              color: fieldState.error
                ? customization?.errorColor || undefined
                : customization?.primaryTextColor || undefined,
            }}
          >
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              {Icon && (
                <Icon
                  className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground"
                  style={{
                    color: customization?.iconColor || undefined,
                  }}
                />
              )}
              <Input
                type={showPasswordToggle && showPassword ? "text" : type}
                placeholder={placeholder}
                className={`auth-input-placeholder ${icon ? "pl-10" : ""} border ${
                  fieldState.error ? "border" : ""
                }`}
                style={{
                  color: fieldState.error
                    ? customization?.errorColor || undefined
                    : customization?.inputTextColor || undefined,
                  borderColor: fieldState.error
                    ? customization?.inputBorderErrorColor || undefined
                    : customization?.inputBorderColor || undefined, // Default border color
                }}
                {...field}
              />

              <style>{`
                 .auth-input-placeholder::placeholder {
                      color: ${customization?.placeholderTextColor || undefined} !important;
                          }
                  input:focus.auth-input-placeholder {
                      outline: none !important;
                      border-color: ${customization?.inputBorderFocusColor || undefined} !important;
                      box-shadow: 0 0 0 1px ${customization?.inputBorderFocusColor || undefined} !important;
                           }
                  `}</style>
              {showPasswordToggle && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  style={{ color: customization?.iconColor || undefined }}
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
                color: customization?.errorColor || "red",
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
  );
};

type CheckboxFieldProps = {
  control: any;
  name: string;
  label: string;
  customization?: AuthCustomizationSettings;
};

export const CheckboxField = ({
  control,
  name,
  label,
  customization,
}: CheckboxFieldProps) => {
  const activeColor = customization?.checkboxActiveColor || "#2563eb";
  const inactiveColor = customization?.checkboxInactiveColor || "#9ca3af";
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const isChecked = !!field.value;
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
                      ? customization?.checkboxActiveColor || undefined
                      : customization?.checkboxInactiveColor || undefined,
                    backgroundColor: field.value
                      ? customization?.checkboxActiveColor || undefined
                      : "transparent",
                  }}
                />
              </FormControl>
              <FormLabel
                className="!mt-0 cursor-pointer"
                style={{
                  color: customization?.primaryTextColor || undefined,
                }}
              >
                {label}
              </FormLabel>
            </div>
          </FormItem>
        );
      }}
    />
  );
};
