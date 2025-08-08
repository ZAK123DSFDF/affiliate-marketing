"use client";

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";
import { useDialogCustomizationOption } from "@/hooks/useDashboardCustomization";

export const DialogCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string;
  dropdownSize?: string;
}) => {
  const {
    dialogBackgroundColor,
    dialogCloseIconColor,
    dialogCloseIconBorderColor,
    setDialogColor,
  } = useDialogCustomizationOption();

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        dialogBackgroundColor: {
          label: "Dialog Background Color",
          value: dialogBackgroundColor,
          onChange: (val) => setDialogColor("dialogBackgroundColor", val),
        },
        dialogCloseIconColor: {
          label: "Close Icon Color",
          value: dialogCloseIconColor,
          onChange: (val) => setDialogColor("dialogCloseIconColor", val),
        },
        dialogCloseIconBorderColor: {
          label: "Close Icon Border Color",
          value: dialogCloseIconBorderColor,
          onChange: (val) => setDialogColor("dialogCloseIconBorderColor", val),
        },
      }}
    />
  );
};
