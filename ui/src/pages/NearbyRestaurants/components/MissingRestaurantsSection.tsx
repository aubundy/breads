import { useEffect, useState } from "react";
import { Accordion, List } from "@mantine/core";
import { IconAlertTriangle, IconMapPinCheck } from "@tabler/icons-react";

import type { UserLocation } from "../../../utils/types";

const accordionIcon = <IconAlertTriangle size={16} color="orange" />;
const listIcon = <IconMapPinCheck size={16} />;

export function MissingRestaurantsSection({
  location,
}: {
  location: UserLocation;
}) {
  const [newPlaces, setNewPlaces] = useState<any[]>([]);

  useEffect(() => {
    const getNewNearby = async () => {
      const results = await fetch(
        `/api/missing-places?lat=${location.lat}&lng=${location.lng}`,
      );
      setNewPlaces(await results.json());
    };

    getNewNearby();
  }, [location.lat, location.lng]);

  return (
    <>
      {newPlaces.length > 0 && (
        <Accordion pb="md">
          <Accordion.Item value="Verify places near you">
            <Accordion.Control icon={accordionIcon}>
              Verify places near you
            </Accordion.Control>
            <Accordion.Panel>
              <List size="sm" spacing="xs" center>
                {newPlaces.map((place) => {
                  return (
                    <List.Item icon={listIcon} onClick={console.log}>
                      {place.googleName} {place.distanceMiles} mi
                    </List.Item>
                  );
                })}
              </List>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      )}
    </>
  );
}
