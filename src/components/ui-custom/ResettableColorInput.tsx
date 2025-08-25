"use client"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { HexColorPicker } from "react-colorful"

type ResettableColorInputProps = {
  label: string
  value: string
  onChange: (val: string) => void
  disabled?: boolean
  showLabel?: boolean
  buttonSize?: string
}

export const ResettableColorInput = ({
  label,
  value,
  onChange,
  disabled = false,
  showLabel = true,
  buttonSize = "w-8 h-8",
}: ResettableColorInputProps) => {
  const [open, setOpen] = useState(false)
  const [color, setColor] = useState(value || "#84C5F4")
  useEffect(() => {
    setColor(value || "#84C5F4")
  }, [value])

  const handleChange = (newColor: string) => {
    setColor(newColor)
    onChange(newColor)
  }

  return (
    <div>
      {showLabel && <Label className="mb-1 block text-xs">{label}</Label>}
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              type="button"
              className={`p-1 text-base ${buttonSize}`}
              disabled={disabled}
              style={{ backgroundColor: color }}
              aria-label="Select color"
            >
              {/* You can use an icon instead of the emoji */}
              <span className="sr-only">Color picker</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start" side="bottom">
            <HexColorPicker color={color} onChange={handleChange} />
            <div className="flex justify-between items-center mt-2">
              <input
                type="text"
                value={color}
                onChange={(e) => handleChange(e.target.value)}
                className="w-24 px-2 py-1 text-sm border rounded"
                disabled={disabled}
              />
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange("")
                    setOpen(false)
                  }}
                  className="text-xs text-muted-foreground hover:text-destructive ml-2"
                  disabled={disabled}
                >
                  Reset
                </button>
              )}
            </div>
          </PopoverContent>
        </Popover>

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
  )
}
