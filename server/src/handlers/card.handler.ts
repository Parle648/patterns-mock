import type { Socket } from "socket.io";

import { CardEvent } from "../common/enums/enums";
import { Card } from "../data/models/card";
import { SocketHandler } from "./socket.handler";
import CardPrototype from "../patterns/copyPrototype";
import { memoService } from "../patterns/memento";
import { List } from "../data/models/list";

class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this))
    socket.on(CardEvent.RENAME, this.changeCardTitle.bind(this))
    socket.on(CardEvent.CHANGE_DESCRIPTION, this.changeCardDescription.bind(this))
    socket.on(CardEvent.CREATE_COPY, this.copyCard.bind(this))
  }

  public createCard(listId: string, cardName: string): void {
    if (listId === undefined || cardName === undefined) {
      this.publisher.log('Error: Card data is empty', 'error');
    }

    this.publisher.log(`Card created with data: ${JSON.stringify({listId, cardName})}`, 'info')

    const newCard = new Card(cardName, "");
    const lists = this.db.getData();

    const listCreateTask: any = lists.map((list) =>
      list.id === listId ? {...list, cards: [...list.cards, newCard]} : list
    );
    
    memoService.createMemo(JSON.stringify(listCreateTask));

    this.db.setData(listCreateTask);
    this.updateLists();
  }

  public copyCard({cardDTO, listId}: {cardDTO: {name: string, description: string}, listId: string}): void {
    if (listId === undefined || cardDTO === undefined) {
      this.publisher.log('Error: Card data is empty', 'error');
    }

    this.publisher.log(`Card copied with data: ${JSON.stringify({listId, cardDTO})}`, 'info')
    // PATTERN: PROTOTYPE
    const newCard = new CardPrototype(cardDTO.name, cardDTO.description).clone();
    const lists = this.db.getData();

    const updatedLists: any = lists.map((list) =>
      list.id === listId ? {...list, cards: [...list.cards, newCard]} : list
    );

    memoService.createMemo(JSON.stringify(updatedLists));

    this.db.setData(updatedLists);
    this.updateLists();
  }

  private reorderCards({
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): void {
    try {
      const lists = this.db.getData();
      const reordered = this.reorderService.reorderCards({
        lists,
        sourceIndex,
        destinationIndex,
        sourceListId,
        destinationListId,
      });
      this.db.setData(reordered);
      this.updateLists();
      
      this.publisher.log(`Card reordered with data: ${JSON.stringify({
        sourceIndex,
        destinationIndex,
        sourceListId,
        destinationListId,
      })}`, 'info')
    } catch (error) {
      this.publisher.log('Error: Card data is empty', 'error');
    }
  }

  public deleteCard({listId, cardId}: {listId: string, cardId: string}): void {
    if (listId === undefined || cardId === undefined) {
      this.publisher.log('Error: Card data is empty', 'error');
    }

    this.publisher.log(`Card deleted with data: ${JSON.stringify({listId, cardId})}`, 'info')
    const lists = this.db.getData();

    const updatedLists = lists.map((list: any) => {
      if (list.id === listId) {
        return {...list, cards: list.cards.filter((card: any) => card.id !== cardId)}
      }
      return list;
    })

    memoService.createMemo(JSON.stringify(updatedLists));

    this.db.setData(updatedLists);
    this.updateLists();
  }

  public changeCardTitle({newTitle, listId, cardId}: {newTitle: string, listId: string, cardId: string}): void {
    const lists = this.db.getData();
    
    const updatedLists = lists.map((list: any) => {
      if (list.id === listId) {
        return {...list, cards: list.cards.map(card => {
          if (card.id === cardId) {
            return {...card, name: newTitle}
          };
          return card;
        })}
      }
      return list;
    })

    memoService.createMemo(JSON.stringify(updatedLists));

    this.db.setData(updatedLists);
    this.updateLists();
  }

  public changeCardDescription({newDescription, listId, cardId}: {newDescription: string, listId: string, cardId: string}): void {
    const lists = this.db.getData();
    
    const updatedLists = lists.map((list: any) => {
      if (list.id === listId) {
        return {...list, cards: list.cards.map(card => {
          if (card.id === cardId) {
            return {...card, description: newDescription}
          };
          return card;
        })}
      }
      return list;
    })

    this.db.setData(updatedLists);
    this.updateLists();
  }
}

export { CardHandler };
