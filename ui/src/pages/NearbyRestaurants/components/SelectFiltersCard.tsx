import { Paper, MultiSelect, Button, Space, Switch } from "@mantine/core";
import type { Filters } from "../../../utils/types";

const options = [
  { value: "restaurant", label: "Restaurant" },
  { value: "ice_cream", label: "Ice Cream" },
  { value: "cafe", label: "Cafe" },
  { value: "bar", label: "Bar" },
  { value: "pub", label: "Pub" },
  { value: "public_building", label: "Public Building" },
  { value: "food_court", label: "Food Court" },
  { value: "fast_food", label: "Fast Food" },
];

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
        checked={!selectedFilters.fastFood}
        label="Show Fast Food options"
        size="md"
        radius="lg"
        onChange={handleFastFoodToggle}
      />
      <MultiSelect
        label="Filter out options"
        data={options}
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
