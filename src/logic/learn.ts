import { answerCard, Card, CardType, getStateOf } from "./card";
import { useCallback, useDebugValue, useEffect, useState } from "react";

export type LearnController = {
  currentCard: Card<CardType> | null;
  nextCard: Function;
  answerCard: Function;
  learningIsFinished: boolean;
  repetitionCount: number;
  learnedCardsLength: number;
  newCardsLength: number;
  learningQueueLength: number;
};

const timeInUrgentQueue: Record<number, number> = {
  0: 60_000,
  1: 300_000,
  3: 600_000,
  5: 1_200_000,
};

function pullCardFrom(
  reservoir: Card<CardType>[],
  setReservoir: Function,
  setCurrentCard: Function
) {
  setCurrentCard(reservoir[0]);
  setReservoir(reservoir.filter((_, i) => i !== 0));
}

export function useLearning(
  cardSet: Card<CardType>[] | null,
  options?: {}
): LearnController {
  const [newCards, setNewCards] = useState<Card<CardType>[]>([]);
  const [learnedCards, setLearnedCards] = useState<Card<CardType>[]>([]);
  const [learningQueue, setLearningQueue] = useState<
    { card: Card<CardType>; due: number }[]
  >([]);
  const [currentCard, setCurrentCard] = useState<Card<CardType> | null>(null);
  const [repetitionCount, setRepetitionCount] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);
  const [requestingNext, setRequestingNext] = useState<boolean>(false);

  //This is the function which is presented to the outside scope
  //It will set the request next state to true, which will trigger the useEffect below
  const requestNext = useCallback(
    () => setRequestingNext(true),
    [setRequestingNext]
  );

  useEffect(() => {
    console.log("use effect");
    console.log(currentCard);
    //IF another card is requested
    //OR there is no current card and there are still cards in the card reservoirs
    if (
      requestingNext ||
      (!currentCard &&
        (newCards.length !== 0 ||
          learnedCards.length !== 0 ||
          learningQueue.length !== 0))
    ) {
      setRequestingNext(false);
      console.log("next called");
      console.log("urgent queue:");
      console.log(learningQueue);

      //Check if there are any learning cards to be presented
      //There have to be items in the learningQueue
      //and the oldest one hast to be due, or instead there have to be no cards
      //left in the other card reservoirs
      if (
        learningQueue.length !== 0 &&
        (learningQueue[0].due <= Date.now() ||
          (newCards.length === 0 && learnedCards.length === 0))
      ) {
        const topItem = learningQueue[0];

        //Double check if the item really exists
        if (!topItem) {
          console.error("invalid urgent queue item");
          return;
        }

        //Set the currently presented card to the item
        setCurrentCard(topItem.card);

        //Shift (remove) the first item using filter(), shift() can't be used as it will directly modify the queue.
        const newUrgentQueue = learningQueue.filter((_, i) => i !== 0);
        setLearningQueue(newUrgentQueue);
      } else {
        const newCardsAvailable = newCards.length > 0;
        const learnedCardsAvailable = learnedCards.length > 0;

        //If there are new cards and learned cards left, decide from which reservoir to pull from
        //TODO use other method than doing to than random, maybe incorporate a parameter from settings
        //If only one reservoir holds cards, pull it from that one
        //If no reservoir holds any more cards, then learning can be considered finished
        if (newCardsAvailable && learnedCardsAvailable) {
          if (Math.random() < 0.5) {
            pullCardFrom(newCards, setNewCards, setCurrentCard);
          } else {
            pullCardFrom(learnedCards, setLearnedCards, setCurrentCard);
          }
        } else if (newCardsAvailable) {
          pullCardFrom(newCards, setNewCards, setCurrentCard);
        } else if (learnedCardsAvailable) {
          pullCardFrom(learnedCards, setLearnedCards, setCurrentCard);
        } else {
          setFinished(true);
        }
      }
    }
  }, [
    learningQueue,
    newCards,
    learnedCards,
    requestNext,
    currentCard,
    requestingNext,
  ]);

  const answer = useCallback(
    async (quality: number) => {
      //Increase repetition count for stats
      setRepetitionCount(repetitionCount + 1);
      if (currentCard) {
        console.log("check: current card exists");
        let pushToUrgentQueue = false;

        //If card was answered badly, the learned stat is reset to false, and it is added back to the urgent queue
        if (quality <= 1) {
          currentCard.model.learned = false;
          pushToUrgentQueue = true;
        } else {
          //If card was answered correctly, but it wasn't learned before, it is added one more time to the urgent queue. But learned gets set to true
          if (!currentCard.model.learned) {
            pushToUrgentQueue = true;
          }
          //Finally, if the card is answered correctly and has been learned before, keep learned true and do nothing
          currentCard.model.learned = true;
        }

        //If previously determined, the card is pushed to urgent queue
        if (pushToUrgentQueue) {
          console.log("pushing to urgent queue");
          setLearningQueue(
            learningQueue.concat({
              card: currentCard,
              due: Date.now() + timeInUrgentQueue[quality],
            })
          );
        }
        console.log("calling sm2 and updating database");

        //Now calculate sm2 and update database
        await answerCard(currentCard, quality, currentCard.model.learned);

        console.log("answer finished");
      }

      requestNext();
    },
    [currentCard, learningQueue, repetitionCount, requestNext]
  );

  //This useEffect is used to filter the cards given in using cardSet and spreading them to the learningQueue and the newCards / learnedCards reservoir
  useEffect(() => {
    if (cardSet && cardSet[0] && repetitionCount === 0) {
      setNewCards(cardSet.filter((card) => getStateOf(card) === "new"));
      setLearnedCards(cardSet.filter((card) => getStateOf(card) === "due"));
      setLearningQueue(
        cardSet
          .filter((card) => getStateOf(card) === "learning")
          .map((card) => ({ card: card, due: Date.now() }))
      );
    }
  }, [cardSet, repetitionCount]);

  return {
    currentCard: currentCard,
    answerCard: answer,
    nextCard: requestNext,
    learningIsFinished: finished,
    repetitionCount: repetitionCount,
    learnedCardsLength: learnedCards.length,
    newCardsLength: newCards.length,
    learningQueueLength: learningQueue.length,
  };
}
