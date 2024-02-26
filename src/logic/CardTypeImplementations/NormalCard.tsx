import { Divider, Stack, Title } from "@mantine/core";
import NormalCardEditor from "../../components/editcard/CardEditor/NormalCardEditor";
import common from "../../style/CommonStyles.module.css";
import { TypeManager, EditMode } from "../TypeManager";
import {
  Card,
  CardType,
  createCardSkeleton,
  deleteCard,
  newCard,
  toPreviewString,
} from "../card";
import { Deck } from "../deck";
import {
  Note,
  NoteContent,
  newNote,
  registerReferenceToNote,
  updateNoteContent,
} from "../note";
import { db } from "../db";

export type NormalContent = {};

export const NormalCardUtils: TypeManager<CardType.Normal> = {
  updateCard(
    params: { front: string; back: string },
    existingCard: Card<CardType.Normal>
  ) {
    updateNoteContent(existingCard.note, {
      type: CardType.Normal,
      front: params.front,
      back: params.back,
    });
    return {
      ...existingCard,
      preview: toPreviewString(params.front),
    };
  },

  createCard(params: { noteId: string; front: string }): Card<CardType.Normal> {
    return {
      ...createCardSkeleton(),
      preview: toPreviewString(params.front),
      note: params.noteId,
      content: { type: CardType.Normal },
    };
  },

  async createNote(params: { front: string; back: string }, deck: Deck) {
    return db.transaction("rw", db.notes, db.decks, db.cards, async () => {
      const noteId = await newNote(deck, {
        type: CardType.Normal,
        front: params.front,
        back: params.back,
      });
      const cardId = await newCard(
        {
          ...createCardSkeleton(),
          preview: toPreviewString(params.front),
          note: noteId,
          content: { type: CardType.Normal },
        },
        deck
      );
      await registerReferenceToNote(noteId, cardId);
    });
  },

  async updateNote(
    params: { front: string; back: string },
    existingNote: Note<CardType.Normal>
  ) {
    return db.transaction("rw", db.notes, db.cards, async () => {
      await updateNoteContent(existingNote.id, {
        type: CardType.Normal,
        front: params.front,
        back: params.back,
      });
      // Will this be needed? Preview may be removed from the card itself.
      await Promise.all([
        existingNote.referencedBy.map((cardId) => {
          return db.cards.update(cardId, {
            preview: toPreviewString(params.front),
          });
        }),
      ]);
    });
  },

  displayQuestion(
    _: Card<CardType.Normal>,
    content?: NoteContent<CardType.Normal>
  ) {
    return (
      <Title
        order={3}
        fw={600}
        dangerouslySetInnerHTML={{ __html: content?.front ?? "" }}
      ></Title>
    );
  },

  displayAnswer(
    card: Card<CardType.Normal>,
    content?: NoteContent<CardType.Normal>,
    place?: "learn" | "notebook"
  ) {
    return (
      <Stack gap={place === "notebook" ? "sm" : "lg"} w="100%">
        {NormalCardUtils.displayQuestion(card, content)}
        <Divider className={common.lightBorderColor} />
        <div dangerouslySetInnerHTML={{ __html: content?.back ?? "" }}></div>
      </Stack>
    );
  },

  displayNote(note: Note<CardType.Normal>) {
    return (
      <Stack gap="sm">
        <Title
          order={3}
          fw={600}
          dangerouslySetInnerHTML={{ __html: note.content?.front ?? "" }}
        ></Title>
        <Divider className={common.lightBorderColor} />
        <div
          dangerouslySetInnerHTML={{ __html: note.content?.back ?? "" }}
        ></div>
      </Stack>
    );
  },

  getSortFieldFromNoteContent(content?: NoteContent<CardType.Normal>) {
    return toPreviewString(content?.front ?? "[error]");
  },

  editor(note: Note<CardType.Normal> | null, deck: Deck, mode: EditMode) {
    return <NormalCardEditor note={note} deck={deck} mode={mode} />;
  },

  async deleteCard(card: Card<CardType.Normal>) {
    deleteCard(card);
  },
};
