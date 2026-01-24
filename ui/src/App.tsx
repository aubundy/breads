import { createTheme, MantineProvider } from "@mantine/core";

import { PageWrapper } from "./components/PageWrapper";
import { NearbyRestaurants } from "./pages/NearbyRestaurants/NearbyRestaurants";

import "@mantine/core/styles.css";
import "./App.css";

const theme = createTheme({
  /** Your theme override here */
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <PageWrapper>
        <NearbyRestaurants />
      </PageWrapper>
    </MantineProvider>
  );
}

export default App;
