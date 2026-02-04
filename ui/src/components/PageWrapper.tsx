import { Title, AppShell } from "@mantine/core";
// import { Title, AppShell, Text } from "@mantine/core";

import { ResponsiveRow } from "./ResponsiveRow";

// import { getUserLocation } from "../services/browser/location";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  // const { source } = getUserLocation();

  return (
    <AppShell padding="md" header={{ height: 60 }}>
      <AppShell.Header>
        <ResponsiveRow>
          <Title style={{ padding: "var(--mantine-spacing-xs)" }} order={1}>
            Breads [beta]
          </Title>
          {/* {source !== "none" ? (
            <Text style={{ padding: "var(--mantine-spacing-xs)" }} size="lg">
              Location given ✓
            </Text>
          ) : (
            <Text style={{ padding: "var(--mantine-spacing-xs)" }} size="lg">
              No location given ✗
            </Text>
          )} */}
        </ResponsiveRow>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
