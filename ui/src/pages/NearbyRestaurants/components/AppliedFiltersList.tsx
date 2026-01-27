import { PillGroup, Pill, Space } from "@mantine/core";
import type { Filters } from "../../../utils/types";

export function AppliedFiltersList({
  appliedFilters,
  onRemoveFilter,
}: {
  appliedFilters: Filters;
  onRemoveFilter: (value: string) => () => void;
}) {
  const { cuisine, fastFood } = appliedFilters;
  const displayedFilters: string[] = [!fastFood ? "Fast Food" : "", ...cuisine];

  return (
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
  );
}
