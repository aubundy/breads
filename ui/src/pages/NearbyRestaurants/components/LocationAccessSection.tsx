import {
  Box,
  Button,
  Flex,
  Paper,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertSquareRounded } from "@tabler/icons-react";
import { validateZipCode } from "../../../utils/validators";
import { getCoordinates } from "../../../services/http/coordinates";
import {
  getUserAnswer,
  requestLocation,
  setUserAnswer,
} from "../../../services/browser/location";
import { useState } from "react";
import type { UserLocation } from "../../../utils/types";

const ZIP_CODE = "zipCode";

export function LocationAccessSection({
  handleLocationUpdate,
}: {
  handleLocationUpdate: (location: UserLocation) => void;
}) {
  const [askPermission, setAskPermission] = useState(getUserAnswer());

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { [ZIP_CODE]: "" },
    validateInputOnBlur: true,
    validate: {
      [ZIP_CODE]: validateZipCode,
    },
  });

  function handleAcceptance(position: GeolocationPosition) {
    setUserAnswer(true);
    handleLocationUpdate({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      source: "gps",
    });
  }

  function handleRejection() {
    console.log("DENIED LOCATION ACCESS");
    setAskPermission(false);
    setUserAnswer(false);
  }

  async function handleSubmit(values: typeof form.values) {
    const location = await getCoordinates(values[ZIP_CODE]);
    handleLocationUpdate(location);
  }

  return (
    <Paper shadow="md" radius="xl" withBorder p="xs">
      {askPermission ? (
        <Box w={"100%"}>
          <Flex direction="column" align="center" justify="center" py="xl">
            <IconAlertSquareRounded size={48} style={{ margin: "0 auto" }} />
            <Text size="lg">
              Location access is required to view nearby restaurants
            </Text>
            <Space h="md" />
            <Button
              size="lg"
              radius="lg"
              variant="outline"
              onClick={requestLocation(handleAcceptance, handleRejection)}
            >
              Give Location
            </Button>
          </Flex>
        </Box>
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Box w={"100%"} p="md">
            <TextInput
              label="Zip Code"
              placeholder="Input placeholder"
              key={form.key(ZIP_CODE)}
              {...form.getInputProps(ZIP_CODE)}
            />
          </Box>
          <Button type="submit">Submit</Button>
        </form>
      )}
    </Paper>
  );
}
