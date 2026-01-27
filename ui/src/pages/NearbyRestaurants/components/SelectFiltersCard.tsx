import { Paper, MultiSelect, Button, Space, Switch } from "@mantine/core";
import { UI_CUISINES } from "../../../utils/constants";
import type { Filters } from "../../../utils/types";

export function SelectFiltersCard({
  hasChange,
  selectedFilters,
  handleFastFoodToggle,
  handleCuisineFilters,
  handleApplyFilters,
}: {
  hasChange: boolean;
  selectedFilters: Filters;
  handleFastFoodToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCuisineFilters: (filters: string[]) => void;
  handleApplyFilters: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <Paper shadow="md" radius="xl" withBorder p="xl" mb="xl" mt="xl">
      <Switch
        checked={selectedFilters.fastFood}
        label="Show Fast Food options"
        size="md"
        radius="lg"
        onChange={handleFastFoodToggle}
      />
      <Space h="md" />
      <MultiSelect
        label="Filter out options"
        data={Object.keys(UI_CUISINES)}
        defaultValue={selectedFilters.cuisine}
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
  );
}
