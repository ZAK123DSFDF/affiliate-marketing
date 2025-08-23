import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Filter emails...",
  className = "max-w-sm",
  debounceMs = 400,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setLocalValue(next);

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      onChange(next);
    }, debounceMs);
  };

  return (
    <Input
      placeholder={placeholder}
      value={localValue}
      onChange={handleChange}
      className={className}
    />
  );
}
