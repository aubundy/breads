import { useEffect, useState } from "react";
import { Paper, Button, Flex, Space, Box, Text, Badge } from "@mantine/core";
import { IconAdjustments, IconAlertSquareRounded } from "@tabler/icons-react";

import { AppliedFiltersList } from "./components/AppliedFiltersList";
import { SelectFiltersCard } from "./components/SelectFiltersCard";
import { ResponsiveRow } from "../../components/ResponsiveRow";
import { Table } from "../../components/Table";

import { getRestaurants } from "../../services/restaurantsService";

import { formatCuisines, formatDistance } from "../../utils/formatters";
import { useBreakpoints } from "../../utils/hooks";

import type { UICuisine, Filters, Restaurant } from "../../utils/types";

const columns = [
  {
    key: 0,
    header: "ID",
    views: ["mobile", "tablet", "desktop"],
    value: (r: Restaurant) => r.id,
  },
  {
    key: 1,
    header: "Restaurant name",
    views: ["mobile", "tablet", "desktop"],
    value: (r: Restaurant) => r.name,
  },
  {
    key: 2,
    header: "Amenity",
    views: ["desktop"],
    value: (r: Restaurant) => r.amenity,
    width: 200,
  },
  {
    key: 3,
    header: "Cuisine",
    views: ["tablet", "desktop"],
    value: (r: Restaurant) => formatCuisines(r.cuisine),
    width: 250,
  },
  {
    key: 4,
    header: "Mi",
    views: ["mobile", "tablet", "desktop"],
    value: (r: Restaurant) => formatDistance(r.distanceMiles),
    width: 70,
  },
];

const initialFiltersState: Filters = {
  fastFood: true,
  cuisine: [] as UICuisine[],
};

export function NearbyRestaurants() {
  const view = useBreakpoints();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [page, setPage] = useState(0);
  const [showSelectFiltersCard, setShowSelectFiltersCard] = useState(false);
  const [selectedFilters, setSelectedFilters] =
    useState<Filters>(initialFiltersState);
  const [appliedFilters, setAppliedFilters] =
    useState<Filters>(initialFiltersState);

  useEffect(() => {
    const fetchRestaurants = async (page: number, appliedFilters: Filters) => {
      try {
        const restaurants = await getRestaurants(page, appliedFilters);

        if (page === 0) {
          setRestaurants(restaurants);
        } else {
          setRestaurants((prev) => [...prev, ...restaurants]);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants(page, appliedFilters);
  }, [page, appliedFilters]);

  function handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setShowSelectFiltersCard((prev) => !prev);
  }

  function handleFastFoodToggle(e: React.ChangeEvent<HTMLInputElement>) {
    const isChecked = e.currentTarget.checked;
    setSelectedFilters((prev) => ({ ...prev, fastFood: isChecked }));
  }

  function handleCuisineFilters(selected: string[]) {
    setSelectedFilters((prev) => ({
      ...prev,
      cuisine: selected as UICuisine[],
    }));
  }

  function handleApplyFilters(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setPage(0);
    setAppliedFilters(selectedFilters);
    setShowSelectFiltersCard(false);
  }

  function onRemoveFilter(filter: string) {
    return () => {
      const newFilters = (prev: Filters) => ({
        fastFood: filter === "Fast Food",
        cuisine: prev.cuisine.filter((f) => f !== filter),
      });

      setPage(0);
      setSelectedFilters(newFilters);
      setAppliedFilters(newFilters);
    };
  }

  const activeColumns = columns.filter((col) => col.views.includes(view));
  const rows = restaurants.map((r) => activeColumns.map((col) => col.value(r)));
  const headers = activeColumns.slice(1).map((col) => ({
    key: col.key,
    name: col.header,
    width: col.width,
  }));

  const hasChange =
    JSON.stringify(selectedFilters) !== JSON.stringify(appliedFilters);

  return (
    <>
      <Paper radius="xl" mb="xl">
        <ResponsiveRow>
          <Button
            size="lg"
            radius="lg"
            leftSection={<IconAdjustments size={14} />}
            variant="light"
            onClick={handleButtonClick}
          >
            {showSelectFiltersCard ? "Hide filters" : "Show filters"}
          </Button>
          <Badge variant="transparent" color="blue" size="xl" radius="md">
            {rows.length || "-"} shown · ≤10 mi
          </Badge>
        </ResponsiveRow>
        {showSelectFiltersCard ? (
          <SelectFiltersCard
            hasChange={hasChange}
            selectedFilters={selectedFilters}
            handleFastFoodToggle={handleFastFoodToggle}
            handleCuisineFilters={handleCuisineFilters}
            handleApplyFilters={handleApplyFilters}
          />
        ) : (
          <AppliedFiltersList
            appliedFilters={appliedFilters}
            onRemoveFilter={onRemoveFilter}
          />
        )}
      </Paper>
      <Paper shadow="md" radius="xl" withBorder p="xs">
        {rows.length > 0 ? (
          <>
            <Table headers={headers} rows={rows} />
            <Space h="md" />
            <Button
              size="lg"
              radius="lg"
              variant="white"
              fullWidth
              onClick={() => setPage((prev) => prev + 1)}
            >
              Load more
            </Button>
          </>
        ) : (
          <Box w={722}>
            <Flex direction="column" align="center" justify="center" py="xl">
              <IconAlertSquareRounded size={48} style={{ margin: "0 auto" }} />
              <Text size="lg">No restaurants found</Text>
            </Flex>
          </Box>
        )}
      </Paper>
    </>
  );
}
