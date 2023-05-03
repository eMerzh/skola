import { Card, CardType, createCardSkeleton } from "../card";
import { Divider, Stack, Title } from "@mantine/core";
import { swapMono } from "../ui";
import { Deck } from "../deck";
import NormalCardEditor from "../../components/editcard/NormalCardEditor";
import React from "react";
import { CardTypeManager, EditMode } from "../CardTypeManager";

export type NormalContent = {
  front: string;
  back: string;
};
export const NormalCardUtils: CardTypeManager<CardType.Normal> = {
  update(
    params: { front: string; back: string },
    existingCard: Card<CardType.Normal>
  ) {
    return {
      ...existingCard,
      content: {
        type: existingCard.content.type,
        front: params.front,
        back: params.back,
      },
    };
  },

  create(params: { front: string; back: string }): Card<CardType.Normal> {
    return {
      ...createCardSkeleton(),
      content: {
        type: CardType.Normal,
        front: params.front,
        back: params.back,
      },
    };
  },

  displayPreview(card: Card<CardType.Normal>) {
    return card.content.front.replace(/<[^>]*>/g, "");
  },

  displayQuestion(card: Card<CardType.Normal>) {
    return (
      <Title
        order={3}
        fw={600}
        dangerouslySetInnerHTML={{ __html: card.content.front }}
      ></Title>
    );
  },

  displayAnswer(card: Card<CardType.Normal>) {
    return (
      <Stack spacing="xl">
        {NormalCardUtils.displayQuestion(card)}
        <Divider sx={(theme) => ({ borderColor: swapMono(theme, 2, 6) })} />
        <div dangerouslySetInnerHTML={{ __html: card.content.back }}></div>
      </Stack>
    );
  },

  editor(card: Card<CardType.Normal> | null, deck: Deck, mode: EditMode) {
    return <NormalCardEditor card={card} deck={deck} mode={mode} />;
  },
};