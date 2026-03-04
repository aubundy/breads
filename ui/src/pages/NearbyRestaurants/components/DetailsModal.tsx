import { useEffect, useState } from "react";
import { Modal, Text, Space, Flex, Loader } from "@mantine/core";

import { getRestaurantDetails } from "../../../services/http/restaurants";

import type { Details } from "../../../utils/types";

export function DetailsModal({
  isOpen,
  name,
  placeId,
  handleModalClose,
}: {
  isOpen: boolean;
  name: string;
  placeId: string;
  handleModalClose: () => void;
}) {
  const [details, setDetails] = useState<Details | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const restaurantDetails = await getRestaurantDetails(placeId);
        setDetails(restaurantDetails);
      } catch (error) {
        setHasError(true);
      }
    };

    isOpen && fetchDetails();
  }, [isOpen]);

  function handleTransitionEnd() {
    setDetails(null);
  }

  return (
    <Modal
      opened={isOpen}
      onClose={handleModalClose}
      onExitTransitionEnd={handleTransitionEnd}
      title={name}
      centered
    >
      {hasError ? (
        <Flex direction="column" justify="space-between" align="center">
          <Text c="red">Failed to load details. Please try again later.</Text>
        </Flex>
      ) : (
        <>
          {details ? (
            <div>
              <p>{details.formattedAddress}</p>
              <p>{details.nationalPhoneNumber}</p>
              <p>{details.rating} ⭐</p>
              <Space h="md" />
            </div>
          ) : (
            <Flex direction="column" justify="space-between" align="center">
              <Loader color="blue" size="xl" />
            </Flex>
          )}
        </>
      )}
      <p>
        <small>Data provided by Google</small>
      </p>
    </Modal>
  );
}
