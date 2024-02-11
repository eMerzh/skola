import { CardTypeManager } from "../CardTypeManager";
import { Card, CardType, createCardSkeleton } from "../card";
import React from "react";

export const UndefinedCardUtils: CardTypeManager<CardType.Undefined> = {
  update(_, existingCard: Card<CardType.Undefined>) {
    return {
      ...existingCard,
      content: {
        type: existingCard.content.type,
      },
    };
  },

  create(): Card<CardType.Undefined> {
    return {
      ...createCardSkeleton(),
      content: {
        type: CardType.Undefined,
      },
    };
  },

  displayPreview() {
    return "Undefined Card Preview";
  },

  displayQuestion() {
    return "Undefined Card Question";
  },

  displayAnswer() {
    return "Undefined Card Answer";
  },

  displayInNotebook() {
    return "Undefined Card Notebook";
  },

  editor() {
    return <span>Undefined Card Editor</span>;
  },
};
