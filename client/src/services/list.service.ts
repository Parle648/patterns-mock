import { ListEvent } from "../common/enums/list-event.enum"
import { socket } from "../context/socket"

export const listService = {
    create (name: string) {
        socket.emit(ListEvent.CREATE, name)
    },
    delete (index: string) {
        socket.emit(ListEvent.DELETE, index);
    },
    rename (newName: string, listId: string) {
        socket.emit(ListEvent.RENAME, {name: newName, listId})
    }
}