import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
type ResettableColorInputProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
};

export const ResettableColorInput = ({
  label,
  value,
  onChange,
}: ResettableColorInputProps) => (
  <div>
    <Label className="mb-1 block">{label}</Label>
    <div className="flex items-center gap-2">
      <Input
        type="color"
        value={value || "#ffffff"}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 h-10 rounded border p-1 cursor-pointer"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-sm text-muted-foreground hover:text-destructive"
        >
          Reset
        </button>
      )}
    </div>
  </div>
);
