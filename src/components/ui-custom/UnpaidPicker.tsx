import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type MonthYear = { month: number; year: number };

export default function UnpaidPicker({
  open,
  onOpenChange,
  months,
  selection,
  setSelection,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  months: MonthYear[];
  selection: MonthYear[];
  setSelection: React.Dispatch<React.SetStateAction<MonthYear[]>>;
}) {
  const toggle = (m: MonthYear) =>
    setSelection((prev) =>
      prev.some((x) => x.month === m.month && x.year === m.year)
        ? prev.filter((x) => !(x.month === m.month && x.year === m.year))
        : [...prev, m],
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select unpaid months</DialogTitle>
        </DialogHeader>

        <div className="space-y-1 max-h-[300px] overflow-y-auto">
          {months.map((m) => {
            const id = `${m.year}-${m.month}`;
            const checked = selection.some(
              (x) => x.month === m.month && x.year === m.year,
            );
            return (
              <label
                key={id}
                className="flex items-center gap-2 cursor-pointer text-sm"
              >
                <Checkbox checked={checked} onCheckedChange={() => toggle(m)} />
                {new Date(m.year, m.month - 1).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </label>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setSelection([])}>
            Clear
          </Button>
          <Button onClick={() => onOpenChange(false)}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
