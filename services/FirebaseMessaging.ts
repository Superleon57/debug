import { getMessaging, getToken, onMessage } from "firebase/messaging";
import localforage from "localforage";

import type { Messaging } from "firebase/messaging";

export let messaging: Messaging;

export const initFirebaseMessaging = async function (): Promise<
  Messaging | undefined
> {
  try {
    messaging = getMessaging();
    await Notification.requestPermission();
    const token = await getToken(messaging);

    localforage.setItem("fcm_token", token);

    return messaging;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const onMessageListener = async () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("onMessage", payload);
      resolve(payload);
    });
  });
};
