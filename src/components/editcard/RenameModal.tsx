import React, { useEffect, useState } from "react";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { Deck, renameDeck } from "../../logic/deck";
import { generalFail } from "../custom/Notification";

interface RenameModalProps {
  deck?: Deck;
  opened: boolean;
  setOpened: Function;
}

function RenameModal({ deck, opened, setOpened }: RenameModalProps) {
  const [nameValue, setNameValue] = useState<string>(deck?.name ?? "");

  useEffect(() => setNameValue(deck?.name ?? ""), [deck]);

  return (
    <Modal
      title={"Rename " + deck?.name}
      opened={opened}
      onClose={() => setOpened(false)}
    >
      <Stack>
        <TextInput
          data-autofocus
          label="New Name"
          value={nameValue}
          onChange={(e) => setNameValue(e.currentTarget.value)}
        />
        <Group position="right" spacing="sm">
          <Button variant="default" onClick={() => setOpened(false)}>
            Cancel
          </Button>
          <Button
            disabled={!deck || nameValue === ""}
            onClick={() => {
              if (deck && nameValue !== "") {
                renameDeck(deck?.id, nameValue)
                  .then(() => {
                    setNameValue("");
                    setOpened(false);
                  })
                  .catch(() => generalFail());
              }
            }}
          >
            Rename
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default RenameModal;
