import React, { ReactNode, createContext, useContext } from "react";
import { UserCredential } from "firebase/auth";

import useFirebaseAuth, { AuthUser } from "hooks/FirebaseAuth";

interface AuthUserContextProps {
  children: ReactNode;
}

type SignInWithEmailAndPassword = (
  email: string,
  password: string
) => Promise<UserCredential>;

type CreateUserWithEmailAndPassword = (
  email: string,
  password: string
) => Promise<UserCredential>;

type ContextDefaultValues = {
  authUser: AuthUser | null;
  loading: boolean;
  signInWithEmailAndPassword: SignInWithEmailAndPassword;
  createUserWithEmailAndPassword: CreateUserWithEmailAndPassword;
  signOut: () => Promise<void>;
};

const contextDefaultValues = {
  authUser: null,
  loading: true,
} as ContextDefaultValues;

const authUserContext = createContext(contextDefaultValues);

export function AuthUserProvider({ children }: AuthUserContextProps) {
  const auth = useFirebaseAuth();
  return (
    <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>
  );
}

export const useAuth = () => useContext(authUserContext);
