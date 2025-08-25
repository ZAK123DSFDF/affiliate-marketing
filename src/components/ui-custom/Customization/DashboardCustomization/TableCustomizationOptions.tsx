import { useTableCustomizationOption } from "@/hooks/useDashboardCustomization"
import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { updateDashboardCustomization } from "@/customization/Dashboard/DashboardCustomizationChanges"

export const TableCustomizationOptions = ({
  triggerSize,
  dropdownSize,
  type = "payment", // default type is "payment"
}: {
  triggerSize?: string
  dropdownSize?: string
  type?: "link" | "payment"
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
  } = useTableCustomizationOption()

  const properties: any = {
    tableHeaderTextColor: {
      label: "Table Header Text Color",
      value: tableHeaderTextColor,
      onChange: (val: string) =>
        updateDashboardCustomization(
          "useTableCustomization",
          "tableHeaderTextColor",
          val
        ),
    },
    tableHoverBackgroundColor: {
      label: "Table Row Hover Background",
      value: tableHoverBackgroundColor,
      onChange: (val: string) =>
        updateDashboardCustomization(
          "useTableCustomization",
          "tableHoverBackgroundColor",
          val
        ),
    },
    tableIconColor: {
      label: "Table Icon Color",
      value: tableIconColor,
      onChange: (val: string) =>
        updateDashboardCustomization(
          "useTableCustomization",
          "tableIconColor",
          val
        ),
    },
    tableIconHoverColor: {
      label: "Table Icon Hover Color",
      value: tableIconHoverColor,
      onChange: (val: string) =>
        updateDashboardCustomization(
          "useTableCustomization",
          "tableIconHoverColor",
          val
        ),
    },
    tableIconHoverBackgroundColor: {
      label: "Table Icon Hover Background",
      value: tableIconHoverBackgroundColor,
      onChange: (val: string) =>
        updateDashboardCustomization(
          "useTableCustomization",
          "tableIconHoverBackgroundColor",
          val
        ),
    },
    tableRowTertiaryTextColor: {
      label: "Table Row Tertiary Text Color",
      value: tableRowTertiaryTextColor,
      onChange: (val: string) =>
        updateDashboardCustomization(
          "useTableCustomization",
          "tableRowTertiaryTextColor",
          val
        ),
    },
    tableBorderColor: {
      label: "Table Border Color",
      value: tableBorderColor,
      onChange: (val: string) =>
        updateDashboardCustomization(
          "useTableCustomization",
          "tableBorderColor",
          val
        ),
    },
  }

  // Add conditionally based on type
  if (type === "payment") {
    properties.tableRowPrimaryTextColor = {
      label: "Table Row Primary Text Color",
      value: tableRowPrimaryTextColor,
      onChange: (val: string) =>
        updateDashboardCustomization(
          "useTableCustomization",
          "tableRowPrimaryTextColor",
          val
        ),
    }
    properties.tableRowBadgeOverDueTextColor = {
      label: "Table Badge Overdue Text Color",
      value: tableRowBadgeOverDueTextColor,
      onChange: (val: string) =>
        updateDashboardCustomization(
          "useTableCustomization",
          "tableRowBadgeOverDueTextColor",
          val
        ),
    }
    properties.tableRowBadgeOverDueBackgroundColor = {
      label: "Table Badge Overdue Background",
      value: tableRowBadgeOverDueBackgroundColor,
      onChange: (val: string) =>
        updateDashboardCustomization(
          "useTableCustomization",
          "tableRowBadgeOverDueBackgroundColor",
          val
        ),
    }
    properties.tableRowBadgePendingTextColor = {
      label: "Table Badge Pending Text Color",
      value: tableRowBadgePendingTextColor,
      onChange: (val: string) =>
        updateDashboardCustomization(
          "useTableCustomization",
          "tableRowBadgePendingTextColor",
          val
        ),
    }
    properties.tableRowBadgePendingBackgroundColor = {
      label: "Table Badge Pending Background",
      value: tableRowBadgePendingBackgroundColor,
      onChange: (val: string) =>
        updateDashboardCustomization(
          "useTableCustomization",
          "tableRowBadgePendingBackgroundColor",
          val
        ),
    }
    properties.tableRowBadgePaidTextColor = {
      label: "Table Badge Paid Text Color",
      value: tableRowBadgePaidTextColor,
      onChange: (val: string) =>
        updateDashboardCustomization(
          "useTableCustomization",
          "tableRowBadgePaidTextColor",
          val
        ),
    }
    properties.tableRowBadgePaidBackgroundColor = {
      label: "Table Badge Paid Background",
      value: tableRowBadgePaidBackgroundColor,
      onChange: (val: string) =>
        updateDashboardCustomization(
          "useTableCustomization",
          "tableRowBadgePaidBackgroundColor",
          val
        ),
    }
  } else if (type === "link") {
    properties.tableRowSecondaryTextColor = {
      label: "Table Row Secondary Text Color",
      value: tableRowSecondaryTextColor,
      onChange: (val: string) =>
        updateDashboardCustomization(
          "useTableCustomization",
          "tableRowSecondaryTextColor",
          val
        ),
    }
  }

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={properties}
    />
  )
}
