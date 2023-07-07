import { useState, useEffect } from "react";
import * as FirebaseAuth from "firebase/auth";

import { auth } from "firebase-config";

export interface AuthUser {
  uid: string;
  email: string | null;
}
const formatAuthUser = (user: FirebaseAuth.User): AuthUser => ({
  uid: user.uid,
  email: user.email,
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const clear = () => {
    setAuthUser(null);

    if (window && window?.socketIo) {
      window.socketIo.disconnect();
    }
  };

  const signInWithEmailAndPassword = (email: string, password: string) =>
    FirebaseAuth.signInWithEmailAndPassword(auth, email, password);

  const createUserWithEmailAndPassword = (email: string, password: string) =>
    FirebaseAuth.createUserWithEmailAndPassword(auth, email, password);

  const signOut = () => FirebaseAuth.signOut(auth).then(clear);

  const idTokenChanged = async (authState: FirebaseAuth.User | null) => {
    if (!authState) {
      setAuthUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const formattedUser = await formatAuthUser(authState);
    setAuthUser(formattedUser);

    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(idTokenChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
  };
}
