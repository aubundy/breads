import { useState } from "react";
import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { getUserLocation, setUserLocation } from "../services/browser/location";

import type { UserLocation } from "./types";

export const useBreakpoints = () => {
  const { breakpoints } = useMantineTheme();

  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs})`);
  const isTablet = useMediaQuery(`(max-width: ${breakpoints.sm})`);

  if (isMobile) return "mobile";
  if (isTablet) return "tablet";
  return "desktop";
};

export const useUserLocation: () => {
  location: UserLocation;
  handleLocationUpdate: (location: UserLocation) => void;
} = () => {
  const [location, setLocation] = useState<UserLocation>(getUserLocation());

  function handleLocationUpdate(location: UserLocation) {
    setLocation(location);
    setUserLocation(location);
  }

  return { location, handleLocationUpdate };
};
