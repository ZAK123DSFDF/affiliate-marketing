"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

type ResettableColorInputProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  showLabel?: boolean;
  buttonSize?: string;
};

export const ResettableColorInput = ({
  label,
  value,
  onChange,
  disabled = false,
  showLabel = true,
  buttonSize = "w-8 h-8",
}: ResettableColorInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const openColorPicker = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div>
      {showLabel && <Label className="mb-1 block text-xs">{label}</Label>}
      <div className="flex items-center gap-2">
        {/* Hidden color input */}
        <input
          ref={inputRef}
          type="color"
          value={value || "#84C5F4"}
          onChange={(e) => onChange(e.target.value)}
          id="style-color-input"
          disabled={disabled}
          className="absolute opacity-0 w-0 h-0"
        />

        {/* Palette icon button triggers the input */}
        <Button
          variant="outline"
          size="icon"
          type="button"
          className={`p-1 text-base ${buttonSize}`}
          onClick={openColorPicker}
          disabled={disabled}
        >
          🎨
        </Button>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-muted-foreground hover:text-destructive"
            disabled={disabled}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
