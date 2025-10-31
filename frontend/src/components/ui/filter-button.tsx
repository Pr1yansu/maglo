import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Combobox } from "./combo-box";

interface Filter {
  label: string;
  value: string;
}

interface ComboGroup {
  fieldLabel?: string;
  options: Filter[];
}

interface FilterGroup {
  groupLabel: string;
  options: Filter[] | ComboGroup[];
}

interface FilterButtonProps {
  children: React.ReactNode;
  filters?: FilterGroup[];
  onApply?: (selectedFilters: Record<string, string | null>) => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  children,
  filters = [],
  onApply,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string | null>
  >({});

  const handleSelect = (name: string, value: string | null) => {
    setSelectedFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setSelectedFilters({});
    onApply?.({});
  };

  const handleApply = () => {
    onApply?.(selectedFilters);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">{children}</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Invoices</SheetTitle>
          <SheetDescription>
            Use the options below to filter your invoices.
          </SheetDescription>
        </SheetHeader>

        <div className="my-4">
          {filters.length === 0 ? (
            <p>No filters available.</p>
          ) : (
            filters.map((group, index) => (
              <div key={index} className="border-b py-4">
                <h3 className="font-medium mb-2 text-secondary-foreground">
                  {group.groupLabel}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {Array.isArray((group.options as any)[0]?.options) ? (
                    (group.options as ComboGroup[]).map((combo, i) => (
                      <div
                        key={`${group.groupLabel}-${i}`}
                        className="flex flex-col gap-1"
                      >
                        <Combobox
                          className="w-[150px]"
                          data={combo.options}
                          name={`${combo.fieldLabel}`}
                          onChange={(value) =>
                            handleSelect(`${combo.fieldLabel}`, value)
                          }
                          value={selectedFilters[`${combo.fieldLabel}`] || ""}
                        />
                      </div>
                    ))
                  ) : (
                    <Combobox
                      className="w-[150px]"
                      data={group.options as Filter[]}
                      name={group.groupLabel}
                      onChange={(value) =>
                        handleSelect(group.groupLabel, value)
                      }
                      value={selectedFilters[group.groupLabel] || ""}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <SheetFooter>
          <Button
            variant="outline"
            disabled={Object.keys(selectedFilters).length === 0}
            onClick={handleReset}
          >
            Reset Filters
          </Button>
          <Button onClick={handleApply}>
            {Object.keys(selectedFilters).length === 0
              ? "Close"
              : "Apply Filters"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterButton;
