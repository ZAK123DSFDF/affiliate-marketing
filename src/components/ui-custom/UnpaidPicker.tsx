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
import { UnpaidMonth } from "@/lib/types/unpaidMonth";

export default function UnpaidPicker({
  open,
  onOpenChange,
  months,
  selection,
  setSelection,
  loading,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  months: UnpaidMonth[];
  selection: UnpaidMonth[];
  setSelection: React.Dispatch<React.SetStateAction<UnpaidMonth[]>>;
  loading: boolean;
}) {
  const toggle = (m: UnpaidMonth) =>
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
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-600" />
            <span className="text-sm text-muted-foreground">
              Loading Months...
            </span>
          </div>
        ) : (
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
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggle(m)}
                  />
                  {new Date(m.year, m.month - 1).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </label>
              );
            })}
          </div>
        )}

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
