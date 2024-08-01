import { CardEvent } from "../common/enums/card-event.enum"
import { socket } from "../context/socket"

export const taskService = {
    create (listId: string, taskName: string): void {
        socket.emit(CardEvent.CREATE, listId, taskName)
    },
    delete (listId: string, cardId: string): void {
        socket.emit(CardEvent.DELETE, {listId, cardId})
    },
    changeTitle (newTitle: string, listId: string, cardId: string) {
        socket.emit(CardEvent.RENAME, {newTitle, listId, cardId})
    },
    changeDescription (newDescription: string, listId: string, cardId: string) {
        socket.emit(CardEvent.CHANGE_DESCRIPTION, {newDescription, listId, cardId})
    },
    copyCard (cardDTO: {name: string, description: string}, listId: string): void {
        socket.emit(CardEvent.CREATE_COPY, {cardDTO, listId})
    }
}