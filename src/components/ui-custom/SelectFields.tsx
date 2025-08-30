"use client"

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

type SelectFieldProps = {
  control: any
  name: string
  label: string
  placeholder?: string
  options: { value: string; label: string }[]
  affiliate: boolean
}

export const SelectField = ({
  control,
  name,
  label,
  placeholder = "Select an option",
  options,
  affiliate = false,
}: SelectFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className={fieldState.error ? "text-destructive" : ""}>
            {label}
          </FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger affiliate={affiliate} className="w-full border">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent affiliate={affiliate}>
                {options.map((opt) => (
                  <SelectItem
                    affiliate={affiliate}
                    key={opt.value}
                    value={opt.value}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {fieldState.error && (
            <div className="text-destructive text-sm font-medium mt-1">
              {fieldState.error.message}
            </div>
          )}
        </FormItem>
      )}
    />
  )
}
