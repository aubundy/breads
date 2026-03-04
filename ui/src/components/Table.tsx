import { Flex, Text, Table as MantineTable, Button } from "@mantine/core";
import type { Cell } from "../utils/types";

type Headers = { key: number; name: string; width?: number }[];

export function Table({ headers, rows }: { headers: Headers; rows: Cell[][] }) {
  return (
    <MantineTable highlightOnHover layout="fixed">
      <MantineTable.Thead>
        <MantineTable.Tr>
          <TableHeaders headers={headers} />
        </MantineTable.Tr>
      </MantineTable.Thead>
      <MantineTable.Tbody>
        <TableRows rows={rows} />
      </MantineTable.Tbody>
    </MantineTable>
  );
}

function TableHeaders({ headers }: { headers: Headers }) {
  return headers.map((header) => (
    <MantineTable.Th key={header.key} style={{ width: header.width }}>
      {header.name}
    </MantineTable.Th>
  ));
}

function TableRows({ rows }: { rows: Cell[][] }) {
  return rows.map((row) => {
    const [id, ...cells] = row;

    return (
      <MantineTable.Tr key={id.text}>
        <Cells cells={cells} />
      </MantineTable.Tr>
    );
  });
}

function Cells({ cells }: { cells: Cell[] }) {
  return cells.map((data) => {
    return (
      <MantineTable.Td>
        <Flex style={{ width: "100%" }}>
          <CellType text={data.text} type={data.type} onClick={data.onClick} />
        </Flex>
      </MantineTable.Td>
    );
  });
}

function CellType({ text, type, onClick }: Cell) {
  switch (type) {
    case "LINK":
      return (
        <Button
          style={{ padding: 0 }}
          variant="transparent"
          size="md"
          onClick={onClick}
        >
          {text}
        </Button>
      );
    case "TEXT":
    default:
      return (
        <Text style={{ flex: 1, minWidth: 0 }} truncate="end">
          {text}
        </Text>
      );
  }
}
