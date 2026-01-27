import { useEffect, useState } from "react";
import { Paper, Button, Flex, Space, Box, Text } from "@mantine/core";
import { IconAdjustments, IconAlertSquareRounded } from "@tabler/icons-react";

import { AppliedFiltersList } from "./components/AppliedFiltersList";
import { FilterCard } from "./components/FilterCard";
import { Table } from "../../components/Table";

import { getRestaurants } from "../../services/restaurantsService";

import { formatCuisines, formatDistance } from "../../utils/formatters";
import { useBreakpoints } from "../../utils/hooks";

import type { Restaurant } from "../../utils/types";

const columns = [
  {
    key: 1,
    header: "Restaurant name",
    views: ["mobile", "tablet", "desktop"],
    value: (r: Restaurant) => r.name,
  },
  {
    key: 2,
    header: "Amenity",
    views: ["tablet", "desktop"],
    value: (r: Restaurant) => r.amenity,
    width: 200,
  },
  {
    key: 3,
    header: "Cuisine",
    views: ["desktop"],
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

export function NearbyRestaurants() {
  const view = useBreakpoints();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [page, setPage] = useState(0);
  const [showFilterCard, setShowFilterCard] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

  useEffect(() => {
    const fetchRestaurants = async (page: number, appliedFilters: string[]) => {
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
    setShowFilterCard((prev) => !prev);
  }

  function handleFilterSelection(selected: string[]) {
    setSelectedFilters(selected);
  }

  function handleApplyFilters(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setPage(0);
    setAppliedFilters(selectedFilters);
    setShowFilterCard(false);
  }

  function onRemoveFilter(filter: string) {
    return () => {
      setPage(0);
      setSelectedFilters((prev) => prev.filter((f) => f !== filter));
      setAppliedFilters((prev) => prev.filter((f) => f !== filter));
    };
  }

  const activeColumns = columns.filter((col) => col.views.includes(view));
  const rows = restaurants.map((r) => activeColumns.map((col) => col.value(r)));
  const headers = activeColumns.map((col) => ({
    key: col.key,
    name: col.header,
    width: col.width,
  }));

  return (
    <>
      <Paper radius="xl" mb="xl">
        <Flex direction="row" justify="space-between" align="center">
          <Button
            size="lg"
            radius="lg"
            leftSection={<IconAdjustments size={14} />}
            variant="light"
            onClick={handleButtonClick}
          >
            {showFilterCard ? "Hide filters" : "Show filters"}
          </Button>
          <Text size="lg">Viewing {rows.length} restaurants</Text>
        </Flex>
        {showFilterCard ? (
          <FilterCard
            hasChange={
              JSON.stringify(selectedFilters) !== JSON.stringify(appliedFilters)
            }
            selectedFilters={selectedFilters}
            handleFilterSelection={handleFilterSelection}
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
