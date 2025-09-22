"use client"

import React from "react"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { UnpaidMonth } from "@/lib/types/unpaidMonth"
import { Checkbox } from "@/components/ui/checkbox"

interface UnpaidSelectProps {
  months: UnpaidMonth[]
  selection: UnpaidMonth[]
  setSelection: React.Dispatch<React.SetStateAction<UnpaidMonth[]>>
  loading: boolean
  onApply: () => void
  disabled?: boolean
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function UnpaidSelect({
  months,
  selection,
  setSelection,
  loading,
  onApply,
  disabled,
  open,
  setOpen,
}: UnpaidSelectProps) {
  const toggle = (m: UnpaidMonth) => {
    setSelection((prev) =>
      prev.some((x) => x.month === m.month && x.year === m.year)
        ? prev.filter((x) => !(x.month === m.month && x.year === m.year))
        : [...prev, m]
    )
  }

  const handleApply = () => {
    onApply()
    setOpen(false)
  }

  return (
    <Select open={open} onOpenChange={setOpen} disabled={disabled}>
      <SelectTrigger affiliate={false} className="w-[180px]">
        {selection.length > 0 ? (
          <span className="text-black">Unpaid Months ({selection.length})</span>
        ) : (
          <span className="text-black">Unpaid Months</span>
        )}
      </SelectTrigger>
      <SelectContent affiliate={false} className="w-[280px] p-2">
        <SelectGroup>
          <SelectLabel>Select unpaid months</SelectLabel>
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-2">
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-600" />
              <span>Loading...</span>
            </div>
          ) : (
            <>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {months.map((m) => {
                  const id = `${m.year}-${m.month}`
                  const checked = selection.some(
                    (x) => x.month === m.month && x.year === m.year
                  )
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                    >
                      <Checkbox
                        id={id}
                        checked={checked}
                        onCheckedChange={() => toggle(m)}
                      />
                      <label
                        htmlFor={id}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {new Date(m.year, m.month - 1).toLocaleString(
                          "default",
                          {
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </label>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-end pt-2 border-t">
                <Button
                  size="sm"
                  onClick={handleApply}
                  disabled={selection.length === 0}
                >
                  Apply
                </Button>
              </div>
            </>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
