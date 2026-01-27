import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export const useBreakpoints = () => {
  const { breakpoints } = useMantineTheme();

  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs})`);
  const isTablet = useMediaQuery(`(max-width: ${breakpoints.sm})`);

  if (isMobile) return "mobile";
  if (isTablet) return "tablet";
  return "desktop";
};
