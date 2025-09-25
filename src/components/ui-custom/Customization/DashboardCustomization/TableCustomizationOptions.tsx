"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { tableCustomizationAtom } from "@/store/DashboardCustomizationAtom"

export const TableCustomizationOptions = ({
  triggerSize,
  dropdownSize,
  type = "payment", // default type is "payment"
}: {
  triggerSize?: string
  dropdownSize?: string
  type?: "link" | "payment"
}) => {
  const [
    {
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
    },
    setTableCustomization,
  ] = useAtom(tableCustomizationAtom)

  const properties: Record<string, any> = {
    tableHeaderTextColor: {
      label: "Table Header Text Color",
      value: tableHeaderTextColor,
      onChange: (val: string) =>
        setTableCustomization((prev) => ({
          ...prev,
          tableHeaderTextColor: val,
        })),
    },
    tableHoverBackgroundColor: {
      label: "Table Row Hover Background",
      value: tableHoverBackgroundColor,
      onChange: (val: string) =>
        setTableCustomization((prev) => ({
          ...prev,
          tableHoverBackgroundColor: val,
        })),
    },
    tableIconColor: {
      label: "Table Icon Color",
      value: tableIconColor,
      onChange: (val: string) =>
        setTableCustomization((prev) => ({
          ...prev,
          tableIconColor: val,
        })),
    },
    tableIconHoverColor: {
      label: "Table Icon Hover Color",
      value: tableIconHoverColor,
      onChange: (val: string) =>
        setTableCustomization((prev) => ({
          ...prev,
          tableIconHoverColor: val,
        })),
    },
    tableIconHoverBackgroundColor: {
      label: "Table Icon Hover Background",
      value: tableIconHoverBackgroundColor,
      onChange: (val: string) =>
        setTableCustomization((prev) => ({
          ...prev,
          tableIconHoverBackgroundColor: val,
        })),
    },
    tableRowTertiaryTextColor: {
      label: "Table Row Tertiary Text Color",
      value: tableRowTertiaryTextColor,
      onChange: (val: string) =>
        setTableCustomization((prev) => ({
          ...prev,
          tableRowTertiaryTextColor: val,
        })),
    },
    tableBorderColor: {
      label: "Table Border Color",
      value: tableBorderColor,
      onChange: (val: string) =>
        setTableCustomization((prev) => ({
          ...prev,
          tableBorderColor: val,
        })),
    },
  }

  // Conditionally add properties based on type
  if (type === "payment") {
    Object.assign(properties, {
      tableRowPrimaryTextColor: {
        label: "Table Row Primary Text Color",
        value: tableRowPrimaryTextColor,
        onChange: (val: string) =>
          setTableCustomization((prev) => ({
            ...prev,
            tableRowPrimaryTextColor: val,
          })),
      },
      tableRowBadgeOverDueTextColor: {
        label: "Table Badge Overdue Text Color",
        value: tableRowBadgeOverDueTextColor,
        onChange: (val: string) =>
          setTableCustomization((prev) => ({
            ...prev,
            tableRowBadgeOverDueTextColor: val,
          })),
      },
      tableRowBadgeOverDueBackgroundColor: {
        label: "Table Badge Overdue Background",
        value: tableRowBadgeOverDueBackgroundColor,
        onChange: (val: string) =>
          setTableCustomization((prev) => ({
            ...prev,
            tableRowBadgeOverDueBackgroundColor: val,
          })),
      },
      tableRowBadgePendingTextColor: {
        label: "Table Badge Pending Text Color",
        value: tableRowBadgePendingTextColor,
        onChange: (val: string) =>
          setTableCustomization((prev) => ({
            ...prev,
            tableRowBadgePendingTextColor: val,
          })),
      },
      tableRowBadgePendingBackgroundColor: {
        label: "Table Badge Pending Background",
        value: tableRowBadgePendingBackgroundColor,
        onChange: (val: string) =>
          setTableCustomization((prev) => ({
            ...prev,
            tableRowBadgePendingBackgroundColor: val,
          })),
      },
      tableRowBadgePaidTextColor: {
        label: "Table Badge Paid Text Color",
        value: tableRowBadgePaidTextColor,
        onChange: (val: string) =>
          setTableCustomization((prev) => ({
            ...prev,
            tableRowBadgePaidTextColor: val,
          })),
      },
      tableRowBadgePaidBackgroundColor: {
        label: "Table Badge Paid Background",
        value: tableRowBadgePaidBackgroundColor,
        onChange: (val: string) =>
          setTableCustomization((prev) => ({
            ...prev,
            tableRowBadgePaidBackgroundColor: val,
          })),
      },
    })
  } else if (type === "link") {
    Object.assign(properties, {
      tableRowSecondaryTextColor: {
        label: "Table Row Secondary Text Color",
        value: tableRowSecondaryTextColor,
        onChange: (val: string) =>
          setTableCustomization((prev) => ({
            ...prev,
            tableRowSecondaryTextColor: val,
          })),
      },
    })
  }

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={properties}
    />
  )
}
