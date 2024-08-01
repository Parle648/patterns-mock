import type { Socket } from "socket.io";

import { ListEvent } from "../common/enums/enums";
import { List } from "../data/models/list";
import { SocketHandler } from "./socket.handler";
import { memoService } from "../patterns/memento";

class ListHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(ListEvent.CREATE, this.createList.bind(this));
    socket.on(ListEvent.GET, this.getLists.bind(this));
    socket.on(ListEvent.REORDER, this.reorderLists.bind(this));
    socket.on(ListEvent.DELETE, this.deleteList.bind(this));
    socket.on(ListEvent.RENAME, this.renameList.bind(this))
  }

  private getLists(callback: (cards: List[]) => void): void {
    callback(this.db.getData());
  }

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    if (sourceIndex === undefined || destinationIndex === undefined) {
      this.publisher.log('Error: List data is empty', 'error');
    }

    this.publisher.log(`List reordered with data: ${JSON.stringify({sourceIndex, destinationIndex})}`, 'info');

    const lists = this.db.getData();
    const reorderedLists = this.reorderService.reorder(
      lists,
      sourceIndex,
      destinationIndex
    );

    memoService.createMemo(JSON.stringify(reorderedLists));

    this.db.setData(reorderedLists);
    this.updateLists();
  }

  private createList(name: string): void {
    if (name === undefined) {
      this.publisher.log('Error: List data is empty', 'error');
    }

    this.publisher.log(`List create with data: ${JSON.stringify({name})}`, 'info');

    const lists = this.db.getData();
    const newList = new List(name);
    this.db.setData(lists.concat(newList));
    memoService.createMemo(JSON.stringify(this.db.getData()));
    this.updateLists();
  }

  private deleteList(listId: string): void {
    if (listId === undefined) {
      this.publisher.log('Error: List data is empty', 'error');
    }

    this.publisher.log(`List deleted with data: ${JSON.stringify({listId})}`, 'info');

    const lists = this.db.getData();
    const filteredLists = lists.filter((list: List) => list.id !== listId);

    memoService.createMemo(JSON.stringify(filteredLists));

    this.db.setData(filteredLists);
    this.updateLists();
  }

  private renameList({name, listId}: {name: string, listId: string}): void {
    if (listId === undefined || name === undefined) {
      this.publisher.log('Error: List data is empty', 'error');
    }

    this.publisher.log(`List renamed with data: ${JSON.stringify({listId, newName: name})}`, 'info');

    const lists = this.db.getData();
    const filteredLists = lists.filter((list: List) => {
      if (list.id === listId) {
        list.name = name;
      };

      return list;
    });

    memoService.createMemo(JSON.stringify(filteredLists));

    this.db.setData(filteredLists);
    this.updateLists();
  }
}

export { ListHandler };
