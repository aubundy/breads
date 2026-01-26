import { Flex, Text, Table as MantineTable } from "@mantine/core";

type Headers = { key: number; name: string; width?: number }[];

export function Table({ headers, rows }: { headers: Headers; rows: any[] }) {
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

function TableRows({ rows }: { rows: any[] }) {
  return rows.map((row) => {
    const [id, ...cells] = row;

    return (
      <MantineTable.Tr key={id}>
        <TableCells cells={cells} />
      </MantineTable.Tr>
    );
  });
}

function TableCells({ cells }: { cells: string[] }) {
  return cells.map((data) => (
    <MantineTable.Td>
      <Flex style={{ width: "100%" }}>
        <Text style={{ flex: 1, minWidth: 0 }} truncate="end">
          {data}
        </Text>
      </Flex>
    </MantineTable.Td>
  ));
}
