import { Title, AppShell, Button, Text } from "@mantine/core";

import { ResponsiveRow } from "./ResponsiveRow";

import { getLocation, requestLocation } from "../services/locationService";
import { storage } from "../services/storageService";

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
            <Button
              style={{
                position: "absolute",
                right: "var(--mantine-spacing-xs)",
              }}
              onClick={() =>
                requestLocation(
                  ({ coords }) =>
                    storage.set("userLocation", {
                      lat: coords.latitude,
                      lng: coords.longitude,
                      source: "gps",
                    }),
                  console.log,
                )
              }
            >
              Give Location
            </Button>
          )}
        </ResponsiveRow>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
