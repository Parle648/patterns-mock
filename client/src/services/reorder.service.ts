import type { DraggableLocation } from "@hello-pangea/dnd";

import { type Card, type List } from "../common/types/types";
import _ from 'lodash'

const reorderArray = <T>(array: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(array);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const removeFromArray = <T>(array: T[], index: number): T[] => {
  return _.filter(array, (_, i) => i !== index);
};

const insertIntoArray = <T>(array: T[], index: number, item: T): T[] => {
  return [...array.slice(0, index), item, ...array.slice(index)];
};

const findListById = (lists: List[], id: string): List | undefined => {
  return lists.find(list => list.id === id);
};

export const reorderLists = (
  items: List[],
  startIndex: number,
  endIndex: number
): List[] => {
  return reorderArray(items, startIndex, endIndex);
};

export const reorderCards = (
  lists: List[],
  source: DraggableLocation,
  destination: DraggableLocation
): List[] => {
  const sourceList = findListById(lists, source.droppableId);
  const destinationList = findListById(lists, destination.droppableId);

  if (!sourceList || !destinationList) {
    return lists;
  }

  const sourceCards = [...sourceList.cards];
  const destinationCards = [...destinationList.cards];
  const cardToMove = sourceCards[source.index];

  const isMovingInSameList = source.droppableId === destination.droppableId;

  if (isMovingInSameList) {
    const reorderedCards = reorderArray(sourceCards, source.index, destination.index);
    return lists.map(list =>
      list.id === source.droppableId ? { ...list, cards: reorderedCards } : list
    );
  }

  const updatedLists = lists.map(list => {
    if (list.id === source.droppableId) {
      return { ...list, cards: removeFromArray(sourceCards, source.index) };
    }

    if (list.id === destination.droppableId) {
      return { ...list, cards: insertIntoArray(destinationCards, destination.index, cardToMove) };
    }

    return list;
  });

  return updatedLists;
};