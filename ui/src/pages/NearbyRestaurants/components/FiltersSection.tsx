import {
  Button,
  MultiSelect,
  Paper,
  Pill,
  PillGroup,
  Space,
  Switch,
} from "@mantine/core";

import type { Filters, UICuisine } from "../../../utils/types";
import { UI_CUISINES } from "../../../utils/constants";
import { useState } from "react";

const defaultFilters: Filters = {
  fastFood: true,
  cuisine: [] as UICuisine[],
};

export function FiltersSection({
  showSelectFiltersCard,
  appliedFilters,
  handleNewFilters,
}: {
  showSelectFiltersCard: boolean;
  appliedFilters: Filters;
  handleNewFilters: (newFilters: Filters) => void;
}) {
  const [pendingFilters, setPendingFilters] = useState<Filters>(defaultFilters);

  function handleFastFoodToggle(e: React.ChangeEvent<HTMLInputElement>) {
    const isChecked = e.currentTarget.checked;
    setPendingFilters((prev) => ({ ...prev, fastFood: isChecked }));
  }

  function handleCuisineFilters(selected: string[]) {
    setPendingFilters((prev) => ({
      ...prev,
      cuisine: selected as UICuisine[],
    }));
  }

  function handleApplyFilters(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    handleNewFilters(pendingFilters);
  }

  function onRemoveFilter(filter: string) {
    return () => {
      const newFilters = {
        fastFood: filter === "Fast Food" || pendingFilters.fastFood,
        cuisine: pendingFilters.cuisine.filter((f) => f !== filter),
      };

      setPendingFilters(newFilters);
      handleNewFilters(newFilters);
    };
  }

  const { cuisine, fastFood } = appliedFilters;
  const amenityFilters: string[] = fastFood ? [] : ["Fast Food"];
  const displayedFilters: string[] = [...amenityFilters, ...cuisine];
  const hasChange =
    JSON.stringify(pendingFilters) !== JSON.stringify(appliedFilters);

  return (
    <>
      {showSelectFiltersCard ? (
        <Paper shadow="md" radius="xl" withBorder p="xl" mb="xl" mt="xl">
          <Switch
            checked={pendingFilters.fastFood}
            label="Show Fast Food options"
            size="md"
            radius="lg"
            onChange={handleFastFoodToggle}
          />
          <Space h="md" />
          <MultiSelect
            label="Filter out options"
            data={Object.keys(UI_CUISINES)}
            defaultValue={pendingFilters.cuisine}
            onChange={handleCuisineFilters}
          />
          <Space h="lg" />
          <Button
            disabled={!hasChange}
            size="lg"
            radius="lg"
            variant="light"
            onClick={handleApplyFilters}
          >
            Apply
          </Button>
        </Paper>
      ) : (
        <>
          {displayedFilters.length > 0 && (
            <>
              <Space h="lg" />
              <PillGroup>
                {displayedFilters.map((filter) => (
                  <Pill
                    style={{ backgroundColor: "var(--mantine-color-red-2)" }}
                    size="xl"
                    withRemoveButton
                    onRemove={onRemoveFilter(filter)}
                  >
                    {filter}
                  </Pill>
                ))}
              </PillGroup>
            </>
          )}
        </>
      )}
    </>
  );
}
