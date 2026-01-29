import { Title, AppShell, Text } from "@mantine/core";

import { ResponsiveRow } from "./ResponsiveRow";

import { getLocation } from "../services/locationService";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const { source } = getLocation();

  return (
    <AppShell padding="md" header={{ height: 60 }}>
      <AppShell.Header>
        <ResponsiveRow>
          <Title style={{ padding: "var(--mantine-spacing-xs)" }} order={1}>
            Breads
          </Title>
          {source === "gps" ? (
            <Text style={{ padding: "var(--mantine-spacing-xs)" }} size="lg">
              Location given ✓
            </Text>
          ) : (
            <Text style={{ padding: "var(--mantine-spacing-xs)" }} size="lg">
              No location given ✗
            </Text>
          )}
        </ResponsiveRow>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
