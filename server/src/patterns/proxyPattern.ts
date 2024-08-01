import { List } from "../data/models/list";
import { ReorderService } from "../services/services";

// PATTERN: proxy
export default class ReorderServiceProxy {
    private reorderService = new ReorderService;

    public reorder<T>(items: T[], startIndex: number, endIndex: number) {
        console.info(`reorder method recieves ${JSON.stringify({items, startIndex, endIndex})}\n`);
        
        return this.reorderService.reorder(items, startIndex, endIndex)
    }

    public reorderCards({
        lists,
        sourceIndex,
        destinationIndex,
        sourceListId,
        destinationListId,
    }: {
        lists: List[];
        sourceIndex: number;
        destinationIndex: number;
        sourceListId: string;
        destinationListId: string;
    }) {
        console.info(`reorderCards method receives the next parametrs : ${JSON.stringify({
            lists,
            sourceIndex,
            destinationIndex,
            sourceListId,
            destinationListId,
        })}\n`);

        return this.reorderService.reorderCards({
            lists,
            sourceIndex,
            destinationIndex,
            sourceListId,
            destinationListId,
        })
    }
    
    private remove<T>(items: T[], index: number): T[] {
        console.info(`remove method recieve the next list of parametrs items: ${items}, index: ${index} \n`);
        
        return [...items.slice(0, index), ...items.slice(index + 1)];
    }
    
    private insert<T>(items: T[], index: number, value: T): T[] {
        console.info(`insert method recieve the next list of parametrs items: ${items}, index: ${index}, value: ${value}\n`);

        return [...items.slice(0, index), value, ...items.slice(index)];
      }
}