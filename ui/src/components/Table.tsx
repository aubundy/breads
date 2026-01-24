import { Box, Text, Table as MantineTable } from "@mantine/core";

export function Table({ headers, rows }: { headers: string[]; rows: any[] }) {
  return (
    <MantineTable highlightOnHover>
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

function TableHeaders({ headers }: { headers: string[] }) {
  return headers.map((header) => <MantineTable.Th>{header}</MantineTable.Th>);
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

function TableCells({ cells }: { cells: { width: number; data: any }[] }) {
  return cells.map(({ width, data }) => (
    <MantineTable.Td>
      <Box w={width}>
        <Text truncate="end">{data}</Text>
      </Box>
    </MantineTable.Td>
  ));
}
