import { useEffect, useState } from "react";
import {
  createTheme,
  Table,
  MantineProvider,
  Paper,
  Title,
  MultiSelect,
  Button,
  PillGroup,
  Pill,
  AppShell,
  Space,
  Text,
  Flex,
} from "@mantine/core";
import { IconAdjustments } from "@tabler/icons-react";

import "@mantine/core/styles.css";
import "./App.css";

const theme = createTheme({
  /** Your theme override here */
});

function renderCuisines(cuisines: string) {
  if (cuisines) {
    return cuisines.replace(/;/g, ", ");
  } else {
    return "-";
  }
}

function App() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchRestaurants = async (page: number, appliedFilters: string[]) => {
      try {
        const filterQuery = "&filterAmenities=" + appliedFilters.join(",");
        const response = await fetch(
          `/api/restaurants?lat=33.4093&lng=-86.8321&page=${page}${filterQuery}`,
        );

        const data = await response.json();
        setRestaurants((prev) => [...prev, ...data]);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants(page, appliedFilters);
  }, [page, appliedFilters]);

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

  const [showFilterCard, setShowFilterCard] = useState(false);

  function handleButtonClick(e: any) {
    e.preventDefault();
    setShowFilterCard((prev) => !prev);
  }

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  function handleApplyFilters(e: any) {
    e.preventDefault();
    console.log("Applying filters:", selectedFilters);
    setPage(0);
    setRestaurants([]);
    setAppliedFilters(selectedFilters);
    setShowFilterCard(false);
  }

  function clearFilter(filter: string) {
    return function onRemove() {
      setPage(0);
      setRestaurants([]);
      setSelectedFilters((prev) => prev.filter((f) => f !== filter));
      setAppliedFilters((prev) => prev.filter((f) => f !== filter));
    };
  }

  return (
    <MantineProvider theme={theme}>
      <AppShell padding="md" header={{ height: 60 }}>
        <AppShell.Header>
          <Title
            style={{ paddingInlineStart: "var(--mantine-spacing-xs)" }}
            order={1}
          >
            Breads
          </Title>
        </AppShell.Header>
        <AppShell.Main>
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
            {!showFilterCard && appliedFilters.length > 0 && (
              <>
                <Space h="lg" />
                <PillGroup>
                  {appliedFilters.map((filter) => (
                    <Pill
                      style={{ backgroundColor: "var(--mantine-color-red-2)" }}
                      size="xl"
                      withRemoveButton
                      onRemove={clearFilter(filter)}
                    >
                      {filter}
                    </Pill>
                  ))}
                </PillGroup>
              </>
            )}
            {showFilterCard && (
              <Paper shadow="md" radius="xl" withBorder p="xl" mb="xl" mt="xl">
                <MultiSelect
                  label="Filter out options"
                  data={options}
                  defaultValue={selectedFilters}
                  onChange={setSelectedFilters}
                />
                <Space h="lg" />
                <Button
                  size="lg"
                  radius="lg"
                  variant="light"
                  onClick={handleApplyFilters}
                >
                  Apply
                </Button>
              </Paper>
            )}
          </Paper>
          <Paper shadow="md" radius="xl" withBorder p="xl">
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Restaurant Name</Table.Th>
                  <Table.Th>Amenity</Table.Th>
                  <Table.Th>Cuisine</Table.Th>
                  <Table.Th>Distance (mi)</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {restaurants.length > 0 &&
                  restaurants.map((restaurant) => (
                    <Table.Tr key={restaurant.id}>
                      <Table.Td>{restaurant.name}</Table.Td>
                      <Table.Td>{restaurant.amenity}</Table.Td>
                      <Table.Td>{renderCuisines(restaurant.cuisine)}</Table.Td>
                      <Table.Td>{restaurant.distanceMiles.toFixed(2)}</Table.Td>
                    </Table.Tr>
                  ))}
              </Table.Tbody>
            </Table>
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
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
