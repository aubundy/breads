import { Paper, MultiSelect, Button, Space } from "@mantine/core";

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

export function FilterCard({
  hasChange,
  selectedFilters,
  handleFilterSelection,
  handleApplyFilters,
}: {
  hasChange: boolean;
  selectedFilters: string[];
  handleFilterSelection: (filters: string[]) => void;
  handleApplyFilters: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <Paper shadow="md" radius="xl" withBorder p="xl" mb="xl" mt="xl">
      <MultiSelect
        label="Filter out options"
        data={options}
        defaultValue={selectedFilters}
        onChange={handleFilterSelection}
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
