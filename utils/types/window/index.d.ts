import { Socket, DefaultEventsMap } from "socket.io-client";

declare global {
  interface Window {
    socketIo?: Socket<DefaultEventsMap, DefaultEventsMap>;
  }
}

export {};
