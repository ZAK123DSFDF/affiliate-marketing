import { useTableCustomizationOption } from "@/hooks/useDashboardCustomization";
import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";

export const TableCustomizationOptions = ({
  triggerSize,
  dropdownSize,
  type = "payment", // default type is "payment"
}: {
  triggerSize?: string;
  dropdownSize?: string;
  type?: "link" | "payment";
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

  const properties: any = {
    tableHeaderTextColor: {
      label: "Table Header Text Color",
      value: tableHeaderTextColor,
      onChange: (val: string) => setTableColor("tableHeaderTextColor", val),
    },
    tableHoverBackgroundColor: {
      label: "Table Row Hover Background",
      value: tableHoverBackgroundColor,
      onChange: (val: string) =>
        setTableColor("tableHoverBackgroundColor", val),
    },
    tableIconColor: {
      label: "Table Icon Color",
      value: tableIconColor,
      onChange: (val: string) => setTableColor("tableIconColor", val),
    },
    tableIconHoverColor: {
      label: "Table Icon Hover Color",
      value: tableIconHoverColor,
      onChange: (val: string) => setTableColor("tableIconHoverColor", val),
    },
    tableIconHoverBackgroundColor: {
      label: "Table Icon Hover Background",
      value: tableIconHoverBackgroundColor,
      onChange: (val: string) =>
        setTableColor("tableIconHoverBackgroundColor", val),
    },
    tableRowTertiaryTextColor: {
      label: "Table Row Tertiary Text Color",
      value: tableRowTertiaryTextColor,
      onChange: (val: string) =>
        setTableColor("tableRowTertiaryTextColor", val),
    },
    tableBorderColor: {
      label: "Table Border Color",
      value: tableBorderColor,
      onChange: (val: string) => setTableColor("tableBorderColor", val),
    },
  };

  // Add conditionally based on type
  if (type === "payment") {
    properties.tableRowPrimaryTextColor = {
      label: "Table Row Primary Text Color",
      value: tableRowPrimaryTextColor,
      onChange: (val: string) => setTableColor("tableRowPrimaryTextColor", val),
    };
    properties.tableRowBadgeOverDueTextColor = {
      label: "Table Badge Overdue Text Color",
      value: tableRowBadgeOverDueTextColor,
      onChange: (val: string) =>
        setTableColor("tableRowBadgeOverDueTextColor", val),
    };
    properties.tableRowBadgeOverDueBackgroundColor = {
      label: "Table Badge Overdue Background",
      value: tableRowBadgeOverDueBackgroundColor,
      onChange: (val: string) =>
        setTableColor("tableRowBadgeOverDueBackgroundColor", val),
    };
    properties.tableRowBadgePendingTextColor = {
      label: "Table Badge Pending Text Color",
      value: tableRowBadgePendingTextColor,
      onChange: (val: string) =>
        setTableColor("tableRowBadgePendingTextColor", val),
    };
    properties.tableRowBadgePendingBackgroundColor = {
      label: "Table Badge Pending Background",
      value: tableRowBadgePendingBackgroundColor,
      onChange: (val: string) =>
        setTableColor("tableRowBadgePendingBackgroundColor", val),
    };
    properties.tableRowBadgePaidTextColor = {
      label: "Table Badge Paid Text Color",
      value: tableRowBadgePaidTextColor,
      onChange: (val: string) =>
        setTableColor("tableRowBadgePaidTextColor", val),
    };
    properties.tableRowBadgePaidBackgroundColor = {
      label: "Table Badge Paid Background",
      value: tableRowBadgePaidBackgroundColor,
      onChange: (val: string) =>
        setTableColor("tableRowBadgePaidBackgroundColor", val),
    };
  } else if (type === "link") {
    properties.tableRowSecondaryTextColor = {
      label: "Table Row Secondary Text Color",
      value: tableRowSecondaryTextColor,
      onChange: (val: string) =>
        setTableColor("tableRowSecondaryTextColor", val),
    };
  }

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={properties}
    />
  );
};
