"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { tableCustomizationAtom } from "@/store/DashboardCustomizationAtom"
import { useThrottledOptionsUpdater } from "@/hooks/useThrottledOptionsUpdater"

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
      tableLoadingColor,
      tableEmptyTextColor,
      tableErrorTextColor,
    },
    setTableCustomization,
  ] = useAtom(tableCustomizationAtom)
  const throttled = useThrottledOptionsUpdater(setTableCustomization, 300)
  const properties: Record<string, any> = {
    tableHeaderTextColor: {
      label: "Table Header Text Color",
      value: tableHeaderTextColor,
      onChange: throttled.tableHeaderTextColor,
    },
    tableHoverBackgroundColor: {
      label: "Table Row Hover Background",
      value: tableHoverBackgroundColor,
      onChange: throttled.tableHoverBackgroundColor,
    },
    tableIconColor: {
      label: "Table Icon Color",
      value: tableIconColor,
      onChange: throttled.tableIconColor,
    },
    tableIconHoverColor: {
      label: "Table Icon Hover Color",
      value: tableIconHoverColor,
      onChange: throttled.tableIconHoverColor,
    },
    tableIconHoverBackgroundColor: {
      label: "Table Icon Hover Background",
      value: tableIconHoverBackgroundColor,
      onChange: throttled.tableIconHoverBackgroundColor,
    },
    tableRowTertiaryTextColor: {
      label: "Table Row Tertiary Text Color",
      value: tableRowTertiaryTextColor,
      onChange: throttled.tableRowTertiaryTextColor,
    },
    tableBorderColor: {
      label: "Table Border Color",
      value: tableBorderColor,
      onChange: throttled.tableBorderColor,
    },
    tableLoadingColor: {
      label: "Table Loading Color",
      value: tableLoadingColor,
      onChange: throttled.tableLoadingColor,
    },
    tableEmptyTextColor: {
      label: "Table Empty Text Color",
      value: tableEmptyTextColor,
      onChange: throttled.tableEmptyTextColor,
    },
    tableErrorTextColor: {
      label: "Table Error Text Color",
      value: tableErrorTextColor,
      onChange: throttled.tableErrorTextColor,
    },
  }

  // Conditionally add properties based on type
  if (type === "payment") {
    Object.assign(properties, {
      tableRowPrimaryTextColor: {
        label: "Table Row Primary Text Color",
        value: tableRowPrimaryTextColor,
        onChange: throttled.tableRowPrimaryTextColor,
      },
      tableRowBadgeOverDueTextColor: {
        label: "Table Badge Overdue Text Color",
        value: tableRowBadgeOverDueTextColor,
        onChange: throttled.tableRowBadgeOverDueTextColor,
      },
      tableRowBadgeOverDueBackgroundColor: {
        label: "Table Badge Overdue Background",
        value: tableRowBadgeOverDueBackgroundColor,
        onChange: throttled.tableRowBadgeOverDueBackgroundColor,
      },
      tableRowBadgePendingTextColor: {
        label: "Table Badge Pending Text Color",
        value: tableRowBadgePendingTextColor,
        onChange: throttled.tableRowBadgePendingTextColor,
      },
      tableRowBadgePendingBackgroundColor: {
        label: "Table Badge Pending Background",
        value: tableRowBadgePendingBackgroundColor,
        onChange: throttled.tableRowBadgePendingBackgroundColor,
      },
      tableRowBadgePaidTextColor: {
        label: "Table Badge Paid Text Color",
        value: tableRowBadgePaidTextColor,
        onChange: throttled.tableRowBadgePaidTextColor,
      },
      tableRowBadgePaidBackgroundColor: {
        label: "Table Badge Paid Background",
        value: tableRowBadgePaidBackgroundColor,
        onChange: throttled.tableRowBadgePaidBackgroundColor,
      },
    })
  } else if (type === "link") {
    Object.assign(properties, {
      tableRowSecondaryTextColor: {
        label: "Table Row Secondary Text Color",
        value: tableRowSecondaryTextColor,
        onChange: throttled.tableRowSecondaryTextColor,
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
