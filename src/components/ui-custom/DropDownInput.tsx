"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type DropdownInputProps = {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange?: (val: string) => void;
  disabled?: boolean;
  placeholder?: string;
  width?: string;
  selectOpen?: boolean;
  setSelectOpen?: (open: boolean) => void;
};

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
      <SelectTrigger className={cn("w-full", width)} disabled={disabled}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
