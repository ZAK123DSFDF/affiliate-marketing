"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

type DropdownInputProps = {
  label: string
  value: string
  options: { label: string; value: string }[]
  onChange?: (val: string) => void
  disabled?: boolean
  placeholder?: string
  width?: string
  selectOpen?: boolean
  setSelectOpen?: (open: boolean) => void
  includeFooter?: boolean
  onFooterClick?: () => void
}

export const DropdownInput = ({
  label,
  value,
  options,
  onChange,
  disabled,
  placeholder = "Select an option",
  width,
  selectOpen,
  setSelectOpen,
  includeFooter = false,
  onFooterClick,
}: DropdownInputProps) => (
  <div className="space-y-1">
    <Label className="text-xs font-medium">{label}</Label>
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      open={selectOpen}
      onOpenChange={setSelectOpen}
    >
      <SelectTrigger
        affiliate={false}
        className={cn("w-full", width)}
        disabled={disabled}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent affiliate={false}>
        {options.map((opt) => (
          <SelectItem affiliate={false} key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
        {includeFooter && (
          <div className="sticky bottom-0 mt-1 border-t border-border bg-background p-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm font-medium"
              onClick={() => {
                onFooterClick?.()
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Org
            </Button>
          </div>
        )}
      </SelectContent>
    </Select>
  </div>
)
