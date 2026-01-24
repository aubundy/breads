import { PillGroup, Pill, Space } from "@mantine/core";

export function AppliedFiltersList({
  appliedFilters,
  onRemoveFilter,
}: {
  appliedFilters: string[];
  onRemoveFilter: (value: string) => () => void;
}) {
  return (
    <>
      {appliedFilters.length > 0 && (
        <>
          <Space h="lg" />
          <PillGroup>
            {appliedFilters.map((filter) => (
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
  );
}
