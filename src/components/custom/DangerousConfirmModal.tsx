import React, { ReactNode } from "react";
import ModalProps from "./ModalProps";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";

interface DangerousConfirmModalProps extends ModalProps {
  dangerousAction: Function;
  dangerousDependencies: Array<any>;
  dangerousTitle: string;
  dangerousDescription: ReactNode;
}

function DangerousConfirmModal({
  dangerousDependencies,
  dangerousAction,
  dangerousTitle,
  dangerousDescription,
  opened,
  setOpened,
}: DangerousConfirmModalProps) {
  return (
    <Modal
      title={dangerousTitle}
      opened={opened}
      onClose={() => setOpened(false)}
    >
      <Stack>
        <Text fz="sm">{dangerousDescription}</Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={() => setOpened(false)}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() => {
              dangerousAction(...dangerousDependencies);
              setOpened(false);
            }}
          >
            {dangerousTitle}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default DangerousConfirmModal;
