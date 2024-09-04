import type { Socket } from 'socket.io'
import type { ExtendedError } from 'socket.io/dist/namespace'
import type { DefaultEventsMap, EventsMap } from 'socket.io/dist/typed-events'

interface SocketData {
  userId: string
}

interface ServerToClientEvents extends DefaultEventsMap {}
interface ClientToServerEvents extends DefaultEventsMap {}
interface InterServerEvents extends DefaultEventsMap {}
export interface ServerEmitEvents extends EventsMap {
  // 'monitor-responses': (data: any) => void
  [event: string]: (data: any) => any
}

export type CustomSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>
export type SocketNext = (err?: ExtendedError | undefined) => void
