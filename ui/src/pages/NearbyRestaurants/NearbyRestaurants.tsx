import { useEffect, useState } from "react";
import { Paper, Button, Badge } from "@mantine/core";
import { IconAdjustments } from "@tabler/icons-react";

import { FiltersSection } from "./components/FiltersSection";
import { LocationAccessSection } from "./components/LocationAccessSection";
import { RestaurantsSection } from "./components/RestaurantsSection";
import { ResponsiveRow } from "../../components/ResponsiveRow";

import { getRestaurants } from "../../services/http/restaurants";

import { TABLE_COLUMNS } from "../../utils/constants";
import { useBreakpoints, useUserLocation } from "../../utils/hooks";

import type { UICuisine, Filters, Restaurant, Status } from "../../utils/types";

const defaultFilters: Filters = {
  fastFood: true,
  cuisine: [] as UICuisine[],
};

export function NearbyRestaurants() {
  const view = useBreakpoints();
  const { location, handleLocationUpdate } = useUserLocation();
  const defaultStatus = location.source === "none" ? "no-location" : "loading";

  const [status, setStatus] = useState<Status>(defaultStatus);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [page, setPage] = useState(0);
  const [range, setRange] = useState(10);
  const [showSelectFiltersCard, setShowSelectFiltersCard] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(defaultFilters);

  useEffect(() => {
    const fetchRestaurants = async (
      page: number,
      range: number,
      appliedFilters: Filters,
    ) => {
      try {
        const results = await getRestaurants(
          location.lat,
          location.lng,
          page,
          range,
          appliedFilters,
        );

        if (page === 0) setRestaurants(results);
        else setRestaurants((prev) => [...prev, ...results]);

        const noResults = results.length === 0 && page === 0;
        setStatus(noResults ? "empty" : "idle");
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setStatus("error");
      }
    };

    location.source !== "none" && fetchRestaurants(page, range, appliedFilters);
  }, [
    location.lat,
    location.lng,
    location.source,
    page,
    range,
    appliedFilters,
  ]);

  function handleShowFilters(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setShowSelectFiltersCard((prev) => !prev);
  }

  function handleNewFilters(newFilters: Filters) {
    setPage(0);
    setRange(10);
    setAppliedFilters(newFilters);
    setShowSelectFiltersCard(false);
  }

  function handleLoadMore() {
    setPage((prev) => prev + 1);
    if (restaurants.length % 25 !== 0) setRange((prev) => prev + 10);
  }

  const activeColumns = TABLE_COLUMNS.filter((col) => col.views.includes(view));
  const rows = restaurants.map((r) => activeColumns.map((col) => col.value(r)));
  const headers = activeColumns.slice(1).map((col) => ({
    key: col.key,
    name: col.header,
    width: col.width,
  }));

  return (
    <>
      <Paper radius="xl" mb="xl">
        <ResponsiveRow>
          <Button
            size="lg"
            radius="lg"
            leftSection={<IconAdjustments size={14} />}
            variant="light"
            onClick={handleShowFilters}
          >
            {showSelectFiltersCard ? "Hide filters" : "Show filters"}
          </Button>
          <Badge variant="transparent" color="blue" size="xl" radius="md">
            {rows.length || "-"} shown · ≤{range} mi
          </Badge>
        </ResponsiveRow>
        <FiltersSection
          showSelectFiltersCard={showSelectFiltersCard}
          appliedFilters={appliedFilters}
          handleNewFilters={handleNewFilters}
        />
      </Paper>
      {location.source === "none" ? (
        <LocationAccessSection handleLocationUpdate={handleLocationUpdate} />
      ) : (
        <RestaurantsSection
          rows={rows}
          headers={headers}
          status={status}
          handleLoadMore={handleLoadMore}
        />
      )}
    </>
  );
}
