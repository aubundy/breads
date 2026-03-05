import { useEffect, useState } from "react";

import { Title, AppShell, Button, Box } from "@mantine/core";
import { IconCurrentLocation } from "@tabler/icons-react";

import { ResponsiveRow } from "./ResponsiveRow";

import { getLocation } from "../services/http/location";

import type { UserLocation } from "../utils/types";

export function PageWrapper({
  location,
  children,
}: {
  location: UserLocation;
  children: React.ReactNode;
}) {
  const [locationName, setLocationName] = useState("Loading");
  console.log(location);
  useEffect(() => {
    async function fetchLocation() {
      const name = await getLocation(location.lat, location.lng);
      setLocationName(name);
    }

    const hasCoordinates = location.lat && location.lng;

    if (hasCoordinates) fetchLocation();
    else setLocationName("Unknown location");
  }, [location.lat, location.lng, location.source]);

  return (
    <AppShell padding="md" header={{ height: 64 }}>
      <AppShell.Header>
        <ResponsiveRow>
          <Title style={{ padding: "var(--mantine-spacing-xs)" }} order={1}>
            Breads
          </Title>
          <Box p="xs">
            <Button
              size="md"
              radius="lg"
              rightSection={<IconCurrentLocation size={14} />}
              variant="light"
              onClick={console.log}
            >
              {locationName}
            </Button>
          </Box>
        </ResponsiveRow>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
