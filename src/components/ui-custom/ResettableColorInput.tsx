import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ResettableColorInputProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
};

export const ResettableColorInput = ({
  label,
  value,
  onChange,
  disabled = false,
}: ResettableColorInputProps) => (
  <div>
    <Label className="mb-1 block">{label}</Label>
    <div className="flex items-center gap-2">
      <Input
        type="color"
        value={value || "#ffffff"}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 p-0 cursor-pointer rounded-sm border-none"
        disabled={disabled}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-sm text-muted-foreground hover:text-destructive"
          disabled={disabled}
        >
          Reset
        </button>
      )}
    </div>
  </div>
);
