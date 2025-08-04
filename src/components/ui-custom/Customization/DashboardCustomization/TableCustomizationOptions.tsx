"use client";

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";
import { useTableCustomizationOption } from "@/hooks/useDashboardCustomization";

export const TableCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string;
  dropdownSize?: string;
}) => {
  const {
    tableHeaderTextColor,
    tableHoverBackgroundColor,
    tableIconColor,
    tableIconHoverColor,
    tableIconHoverBackgroundColor,
    tableRowPrimaryTextColor,
    tableRowSecondaryTextColor,
    tableRowTertiaryTextColor,
    tableRowBadgeOverDueTextColor,
    tableRowBadgeOverDueBackgroundColor,
    tableRowBadgePendingTextColor,
    tableRowBadgePendingBackgroundColor,
    tableRowBadgePaidTextColor,
    tableRowBadgePaidBackgroundColor,
    setTableColor,
  } = useTableCustomizationOption();

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        tableHeaderTextColor: {
          label: "Table Header Text Color",
          value: tableHeaderTextColor,
          onChange: (val) => setTableColor("tableHeaderTextColor", val),
        },
        tableHoverBackgroundColor: {
          label: "Row Hover Background",
          value: tableHoverBackgroundColor,
          onChange: (val) => setTableColor("tableHoverBackgroundColor", val),
        },
        tableIconColor: {
          label: "Icon Color",
          value: tableIconColor,
          onChange: (val) => setTableColor("tableIconColor", val),
        },
        tableIconHoverColor: {
          label: "Icon Hover Color",
          value: tableIconHoverColor,
          onChange: (val) => setTableColor("tableIconHoverColor", val),
        },
        tableIconHoverBackgroundColor: {
          label: "Icon Hover Background",
          value: tableIconHoverBackgroundColor,
          onChange: (val) =>
            setTableColor("tableIconHoverBackgroundColor", val),
        },
        tableRowPrimaryTextColor: {
          label: "Row Primary Text Color",
          value: tableRowPrimaryTextColor,
          onChange: (val) => setTableColor("tableRowPrimaryTextColor", val),
        },
        tableRowSecondaryTextColor: {
          label: "Row Secondary Text Color",
          value: tableRowSecondaryTextColor,
          onChange: (val) => setTableColor("tableRowSecondaryTextColor", val),
        },
        tableRowTertiaryTextColor: {
          label: "Row Tertiary Text Color",
          value: tableRowTertiaryTextColor,
          onChange: (val) => setTableColor("tableRowTertiaryTextColor", val),
        },
        tableRowBadgeOverDueTextColor: {
          label: "Badge Overdue Text Color",
          value: tableRowBadgeOverDueTextColor,
          onChange: (val) =>
            setTableColor("tableRowBadgeOverDueTextColor", val),
        },
        tableRowBadgeOverDueBackgroundColor: {
          label: "Badge Overdue Background",
          value: tableRowBadgeOverDueBackgroundColor,
          onChange: (val) =>
            setTableColor("tableRowBadgeOverDueBackgroundColor", val),
        },
        tableRowBadgePendingTextColor: {
          label: "Badge Pending Text Color",
          value: tableRowBadgePendingTextColor,
          onChange: (val) =>
            setTableColor("tableRowBadgePendingTextColor", val),
        },
        tableRowBadgePendingBackgroundColor: {
          label: "Badge Pending Background",
          value: tableRowBadgePendingBackgroundColor,
          onChange: (val) =>
            setTableColor("tableRowBadgePendingBackgroundColor", val),
        },
        tableRowBadgePaidTextColor: {
          label: "Badge Paid Text Color",
          value: tableRowBadgePaidTextColor,
          onChange: (val) => setTableColor("tableRowBadgePaidTextColor", val),
        },
        tableRowBadgePaidBackgroundColor: {
          label: "Badge Paid Background",
          value: tableRowBadgePaidBackgroundColor,
          onChange: (val) =>
            setTableColor("tableRowBadgePaidBackgroundColor", val),
        },
      }}
    />
  );
};
