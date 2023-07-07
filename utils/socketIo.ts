import { io } from "socket.io-client";

import { auth } from "firebase-config";

import config from "./config";

const newOrderEvent = new Event("newOrder");

export const initSocketIo = async () => {
  const token = await auth.currentUser?.getIdToken();

  const socket = io(config.API_URL || "", {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  socket.on("connect", () => {
    console.log("connected");
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });

  socket.on("ORDER:NEW", () => {
    window.dispatchEvent(newOrderEvent);
  });

  socket.on("ORDER:DELIVERED", ({ order }) => {
    const orderDeliveredEvent = new CustomEvent("orderDelivered", {
      detail: { order },
    });
    window.dispatchEvent(orderDeliveredEvent);
  });

  return socket;
};
