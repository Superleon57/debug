import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import localforage from "localforage";

const firebaseConfig = {
  apiKey: "AIzaSyCbPC1COVoxpE1Vyu6tHdPKIfoCBUtgAP4",
  authDomain: "livapis-55a3a.firebaseapp.com",
  databaseURL: "https://livapis-55a3a-default-rtdb.firebaseio.com",
  projectId: "livapis-55a3a",
  storageBucket: "livapis-55a3a.appspot.com",
  messagingSenderId: "477716057173",
  appId: "1:477716057173:web:04a0ee1daf53152c5198dc",
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const onMessageListener = async () => {
  const messaging = getMessaging(app);
  await getToken(messaging);

  return new Promise((resolve) =>
    onMessage(messaging, (payload) => {
      resolve(payload);
    })
  );
};

const tokenInlocalforage = async () => {
  return localforage.getItem("fcm_token");
};

export const getMessagingToken = async () => {
  const token = await tokenInlocalforage();
  if (token !== null) {
    return token;
  }
  const messaging = getMessaging(app);
  return await getToken(messaging);
};
