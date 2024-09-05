import type { CustomSocket } from "websocket/types"

export const handleSocketSubscribe = (socket: CustomSocket, data: { [resource: string]: string[] }) => {
  console.log('Handling subscribe: ', data)
  const rooms: string[] = []
  for (const [resource, ids] of Object.entries(data)) {
    for (const id of ids) {
      rooms.push(`${resource}-${id}`)
    }
  }

  socket.join(rooms)
}