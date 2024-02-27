import { ActionIcon, Kbd, Menu } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import {
  IconArrowsExchange,
  IconDots,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { t } from "i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShowShortcutHints } from "../../logic/Settings";
import { CardType } from "../../logic/card";
import { Note, deleteNote } from "../../logic/note";
import DangerousConfirmModal from "../custom/DangerousConfirmModal";
import {
  deleteFailed,
  successfullyDeleted,
} from "../custom/Notification/Notification";

interface NoteMenuProps {
  note: Note<CardType> | undefined;
  withEdit?: boolean;
  withShortcuts?: boolean;
  onDelete?: Function;
}

function NoteMenu({
  note,
  onDelete,
  withEdit = true,
  withShortcuts = true,
}: NoteMenuProps) {
  const navigate = useNavigate();

  useState<boolean>(false);

  //const [moveModalOpened, setMoveModalOpened] = useState<boolean>(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);

  async function tryDeleteNote() {
    if (!note) {
      return;
    }
    try {
      await deleteNote(note);
      if (onDelete) {
        onDelete();
      }
      setDeleteModalOpened(false);
      successfullyDeleted("note");
    } catch (error) {
      deleteFailed("note");
      console.log(error);
    }
  }
  const showShortcutHints = useShowShortcutHints();
  useHotkeys(
    withShortcuts
      ? [
          ["e", () => navigate(`/notes/${note?.deck}/${note?.id}`)],
          //["m", () => setMoveModalOpened(true)],
          ["Backspace", () => setDeleteModalOpened(true)],
        ]
      : []
  );

  if (!note) return null;
  return (
    <>
      <Menu position="bottom-end">
        <Menu.Target>
          <ActionIcon variant="subtle" color="gray">
            <IconDots />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {withEdit && (
            <Menu.Item
              leftSection={<IconEdit size={16} />}
              rightSection={withShortcuts && showShortcutHints && <Kbd>e</Kbd>}
              onClick={() => navigate(`/notes/${note.deck}/${note.id}`)}
            >
              {t("note.menu.edit")}
            </Menu.Item>
          )}
          <Menu.Item
            leftSection={<IconArrowsExchange size={16} />}
            rightSection={withShortcuts && showShortcutHints && <Kbd>m</Kbd>}
            disabled
            //onClick={() => setMoveModalOpened(true)}
          >
            {t("note.menu.move")} Not implemented yet
          </Menu.Item>
          <Menu.Item
            color="red"
            leftSection={<IconTrash size={16} />}
            rightSection={withShortcuts && showShortcutHints && <Kbd>←</Kbd>}
            onClick={() => setDeleteModalOpened(true)}
          >
            {t("note.menu.delete")}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <DangerousConfirmModal
        dangerousAction={() => tryDeleteNote()}
        dangerousDependencies={[note]}
        dangerousTitle={t("note.delete-modal.title")}
        dangerousDescription={t("note.delete-modal.description")}
        opened={deleteModalOpened}
        setOpened={setDeleteModalOpened}
      />
    </>
  );
}

export default NoteMenu;
