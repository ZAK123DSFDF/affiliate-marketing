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
    tableBorderColor,
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
          label: "Table Row Hover Background",
          value: tableHoverBackgroundColor,
          onChange: (val) => setTableColor("tableHoverBackgroundColor", val),
        },
        tableIconColor: {
          label: "Table Icon Color",
          value: tableIconColor,
          onChange: (val) => setTableColor("tableIconColor", val),
        },
        tableIconHoverColor: {
          label: " Table Icon Hover Color",
          value: tableIconHoverColor,
          onChange: (val) => setTableColor("tableIconHoverColor", val),
        },
        tableIconHoverBackgroundColor: {
          label: "Table Icon Hover Background",
          value: tableIconHoverBackgroundColor,
          onChange: (val) =>
            setTableColor("tableIconHoverBackgroundColor", val),
        },
        tableRowPrimaryTextColor: {
          label: "Table Row Primary Text Color",
          value: tableRowPrimaryTextColor,
          onChange: (val) => setTableColor("tableRowPrimaryTextColor", val),
        },
        tableRowSecondaryTextColor: {
          label: "Table Row Secondary Text Color",
          value: tableRowSecondaryTextColor,
          onChange: (val) => setTableColor("tableRowSecondaryTextColor", val),
        },
        tableRowTertiaryTextColor: {
          label: "Table Row Tertiary Text Color",
          value: tableRowTertiaryTextColor,
          onChange: (val) => setTableColor("tableRowTertiaryTextColor", val),
        },
        tableRowBadgeOverDueTextColor: {
          label: "Table Badge Overdue Text Color",
          value: tableRowBadgeOverDueTextColor,
          onChange: (val) =>
            setTableColor("tableRowBadgeOverDueTextColor", val),
        },
        tableRowBadgeOverDueBackgroundColor: {
          label: " Table Badge Overdue Background",
          value: tableRowBadgeOverDueBackgroundColor,
          onChange: (val) =>
            setTableColor("tableRowBadgeOverDueBackgroundColor", val),
        },
        tableRowBadgePendingTextColor: {
          label: "Table Badge Pending Text Color",
          value: tableRowBadgePendingTextColor,
          onChange: (val) =>
            setTableColor("tableRowBadgePendingTextColor", val),
        },
        tableRowBadgePendingBackgroundColor: {
          label: "Table Badge Pending Background",
          value: tableRowBadgePendingBackgroundColor,
          onChange: (val) =>
            setTableColor("tableRowBadgePendingBackgroundColor", val),
        },
        tableRowBadgePaidTextColor: {
          label: "Table Badge Paid Text Color",
          value: tableRowBadgePaidTextColor,
          onChange: (val) => setTableColor("tableRowBadgePaidTextColor", val),
        },
        tableRowBadgePaidBackgroundColor: {
          label: "Table Badge Paid Background",
          value: tableRowBadgePaidBackgroundColor,
          onChange: (val) =>
            setTableColor("tableRowBadgePaidBackgroundColor", val),
        },
        tableBorderColor: {
          label: "Table Border Color",
          value: tableBorderColor,
          onChange: (val) => setTableColor("tableBorderColor", val),
        },
      }}
    />
  );
};
