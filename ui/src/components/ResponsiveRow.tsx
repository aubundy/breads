import { Flex } from "@mantine/core";

import type { ReactNode } from "react";

export function ResponsiveRow({ children }: { children: ReactNode }) {
  return (
    <Flex
      direction="row"
      justify="space-between"
      align="center"
      wrap="wrap"
      gap="md"
    >
      {children}
    </Flex>
  );
}
