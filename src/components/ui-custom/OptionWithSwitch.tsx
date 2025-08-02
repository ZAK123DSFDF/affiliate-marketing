"use client";

import { Switch } from "@/components/ui/switch";
import { ResettableColorInput } from "./ResettableColorInput";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ColorProperty = {
  label: string;
  value: string;
  onChange: (val: string) => void;
};

type SwitchProperty = {
  label: string;
  enabled: boolean;
  onToggle: (val: boolean) => void;
  children?: Record<string, ColorProperty | SwitchProperty>;
};

type OptionProps<T> = {
  properties: T;
};

export const OptionWithSwitch = <
  T extends Record<string, ColorProperty | SwitchProperty>,
>({
  properties,
}: OptionProps<T>) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          type="button"
          className="p-1 text-base"
        >
          ⚙️
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] max-h-[400px] overflow-auto">
        <Accordion type="multiple" className="flex flex-col gap-2">
          {Object.entries(properties).map(([key, prop]) => {
            if ("value" in prop) {
              return (
                <ResettableColorInput
                  key={key}
                  label={prop.label}
                  value={prop.value}
                  onChange={prop.onChange}
                />
              );
            }

            if ("enabled" in prop) {
              return (
                <AccordionItem key={key} value={key}>
                  <div className="flex items-center justify-between px-2">
                    <span className="text-sm font-medium">{prop.label}</span>
                    <Switch
                      checked={prop.enabled}
                      onCheckedChange={prop.onToggle}
                    />
                  </div>
                  <AccordionTrigger
                    className={cn(
                      "px-2 text-left hover:no-underline",
                      !prop.enabled && "pointer-events-none opacity-50",
                    )}
                  >
                    <span className="text-xs text-muted-foreground">
                      {prop.enabled ? "Customize" : "Disabled"}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-4 pt-2 space-y-2">
                    {prop.children &&
                      Object.entries(prop.children).map(
                        ([childKey, childProp]) => {
                          if ("value" in childProp) {
                            return (
                              <ResettableColorInput
                                key={childKey}
                                label={childProp.label}
                                value={childProp.value}
                                onChange={childProp.onChange}
                                disabled={!prop.enabled}
                              />
                            );
                          }
                          if ("enabled" in childProp) {
                            return (
                              <div
                                key={childKey}
                                className="flex items-center justify-between pl-2"
                              >
                                <span className="text-sm">
                                  {childProp.label}
                                </span>
                                <Switch
                                  checked={childProp.enabled}
                                  onCheckedChange={childProp.onToggle}
                                  disabled={!prop.enabled}
                                />
                              </div>
                            );
                          }
                          return null;
                        },
                      )}
                  </AccordionContent>
                </AccordionItem>
              );
            }

            return null;
          })}
        </Accordion>
      </PopoverContent>
    </Popover>
  );
};
