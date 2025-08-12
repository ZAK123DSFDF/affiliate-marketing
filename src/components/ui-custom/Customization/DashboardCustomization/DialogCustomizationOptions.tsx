"use client";

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";
import { useDialogCustomizationOption } from "@/hooks/useDashboardCustomization";
import { updateDashboardCustomization } from "@/customization/Dashboard/DashboardCustomizationChanges";

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
  } = useDialogCustomizationOption();

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        dialogBackgroundColor: {
          label: "Dialog Background Color",
          value: dialogBackgroundColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useDialogCustomization",
              "dialogBackgroundColor",
              val,
            ),
        },
        dialogCloseIconColor: {
          label: "Close Icon Color",
          value: dialogCloseIconColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useDialogCustomization",
              "dialogCloseIconColor",
              val,
            ),
        },
        dialogCloseIconBorderColor: {
          label: "Close Icon Border Color",
          value: dialogCloseIconBorderColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useDialogCustomization",
              "dialogCloseIconBorderColor",
              val,
            ),
        },
      }}
    />
  );
};
