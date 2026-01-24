import { useEffect, useState } from "react";
import { Paper, Button, Text, Flex, Space } from "@mantine/core";
import { IconAdjustments } from "@tabler/icons-react";

import { AppliedFiltersList } from "./components/AppliedFiltersList";
import { FilterCard } from "./components/FilterCard";
import { Table } from "../../components/Table";

import { getRestaurants } from "../../services/restaurantsService";

import { formatCuisines, formatDistance } from "../../utils/formatters";

import type { Restaurant } from "../../utils/types";

const headers = ["Restaurant Name", "Amenity", "Cuisine", "Distance (mi)"];

export function NearbyRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [page, setPage] = useState(0);
  const [showFilterCard, setShowFilterCard] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

  useEffect(() => {
    const fetchRestaurants = async (page: number, appliedFilters: string[]) => {
      try {
        const restaurants = await getRestaurants(page, appliedFilters);
        setRestaurants((prev) => [...prev, ...restaurants]);
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
    setRestaurants([]);
    setAppliedFilters(selectedFilters);
    setShowFilterCard(false);
  }

  function onRemoveFilter(filter: string) {
    return () => {
      setPage(0);
      setRestaurants([]);
      setSelectedFilters((prev) => prev.filter((f) => f !== filter));
      setAppliedFilters((prev) => prev.filter((f) => f !== filter));
    };
  }

  const rows = restaurants.map((r) => [
    { data: r.id },
    { data: r.name, width: 260 },
    { data: r.amenity, width: 90 },
    { data: formatCuisines(r.cuisine), width: 175 },
    { data: formatDistance(r.distanceMiles), width: 115 },
  ]);

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
          <Text size="lg">Viewing {restaurants.length} restaurants</Text>
        </Flex>
        {showFilterCard ? (
          <FilterCard
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
      <Paper shadow="md" radius="xl" withBorder p="xl">
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
      </Paper>
    </>
  );
}
