import { Paper, Button, Flex, Space, Box, Text, Skeleton } from "@mantine/core";
import { IconAlertSquareRounded } from "@tabler/icons-react";

import { Table } from "../../../components/Table";

import type { Status } from "../../../utils/types";

export function RestaurantsSection({
  rows,
  headers,
  status,
  handleLoadMore,
}: {
  rows: string[][];
  headers: { key: number; name: string; width?: number }[];
  status: Status;
  handleLoadMore: () => void;
}) {
  if (status === "loading") {
    return (
      <Paper shadow="md" radius="xl" withBorder p="xs">
        <Skeleton width={"100%"} height={800} radius="xl" />
      </Paper>
    );
  }

  if (status === "empty") {
    return (
      <Paper shadow="md" radius="xl" withBorder p="xs">
        <Box w={"100%"}>
          <Flex direction="column" align="center" justify="center" py="xl">
            <IconAlertSquareRounded size={48} style={{ margin: "0 auto" }} />
            <Text size="lg">No restaurants found</Text>
          </Flex>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper shadow="md" radius="xl" withBorder p="xs">
      <Table headers={headers} rows={rows} />
      <Space h="md" />
      <Button
        size="lg"
        radius="lg"
        variant="subtle"
        fullWidth
        onClick={handleLoadMore}
      >
        Load more
      </Button>
    </Paper>
  );
}
