import { Card, CardContent } from "@/components/ui/card";
import MonthSelect from "@/components/ui-custom/MonthSelect";
import { initialKpiData } from "@/lib/types/dummyKpiData";
import { useState } from "react";

interface CardsProps {
  affiliate?: boolean;
  isPreview?: boolean;
}

const Cards = ({ affiliate = false, isPreview = false }: CardsProps) => {
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>();
  const [selectedYear, setSelectedYear] = useState<string | undefined>();

  const filteredData = affiliate
    ? initialKpiData.filter(
        (item) =>
          item.label !== "Total Affiliates" && item.label !== "Total Amount",
      )
    : initialKpiData;

  return (
    <div className="space-y-6">
      <Card className={isPreview ? "mt-2" : ""}>
        <CardContent className="space-y-6 pt-6">
          <MonthSelect
            value={{
              month: selectedMonth ? parseInt(selectedMonth) : undefined,
              year: selectedYear ? parseInt(selectedYear) : undefined,
            }}
            onChange={(month, year) => {
              setSelectedMonth(month ? month.toString() : undefined);
              setSelectedYear(year ? year.toString() : undefined);
            }}
          />
          <div
            className={`grid ${
              isPreview
                ? "grid-cols-2 sm:grid-cols-3 gap-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            }`}
          >
            {filteredData.map(({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                className={`p-3 ${
                  isPreview ? "text-sm" : "text-base"
                } border rounded-lg shadow-sm flex items-center gap-4`}
              >
                <div
                  className={`p-2 ${
                    isPreview ? "w-8 h-8" : "p-3"
                  } rounded-xl ${bg} flex-shrink-0`}
                >
                  <Icon
                    className={`${isPreview ? "w-4 h-4" : "w-8 h-8"} ${color}`}
                  />
                </div>
                <div className="space-y-1 overflow-hidden">
                  <div className="text-muted-foreground font-medium truncate">
                    {label}
                  </div>
                  <div className="font-bold leading-tight truncate">
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default Cards;
