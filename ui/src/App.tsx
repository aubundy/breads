import { createTheme, MantineProvider } from "@mantine/core";

import { PageWrapper } from "./components/PageWrapper";
import { NearbyRestaurants } from "./pages/NearbyRestaurants/NearbyRestaurants";
import { useUserLocation } from "./utils/hooks";

import "@mantine/core/styles.css";
import "./App.css";

const theme = createTheme({
  /** Your theme override here */
});

function App() {
  const { location, handleLocationUpdate } = useUserLocation();

  return (
    <MantineProvider theme={theme}>
      <PageWrapper location={location}>
        <NearbyRestaurants
          location={location}
          handleLocationUpdate={handleLocationUpdate}
        />
      </PageWrapper>
    </MantineProvider>
  );
}

export default App;
