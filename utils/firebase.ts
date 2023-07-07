import { Timestamp } from "firebase/firestore";

import { FirebaseTimestamp } from "./types/FirebaseTimestamp";

export const formatDate = (firebaseTimestamp: FirebaseTimestamp) => {
  const { _seconds, _nanoseconds } = firebaseTimestamp;

  const timestamp = new Timestamp(_seconds, _nanoseconds);

  return timestamp.toDate();
};
