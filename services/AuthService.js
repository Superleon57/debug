import { sendPasswordResetEmail, signOut } from "firebase/auth";
import axios from "axios";

import { getState } from "../store";
import { auth } from "../firebase-config.js";

export const registerWithEmailAndPassword = async (
  firstName,
  lastName,
  email,
  password
) => {
  var data = JSON.stringify({
    payload: {
      email,
      password,
      lastName,
      firstName,
    },
  });

  var config = {
    method: "post",
    url: "http://localhost:3000/api/v1/auth/user-signup",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config)
    .then((response) => response)
    .catch(function (error) {
      console.log(error);
    });
};

export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const logout = () => {
  signOut(auth);
};

export const getIdToken = async () => {
  const state = getState();
  const token = state.auth.auth.idToken;
  return token;
};

export const getShopId = async () => {
  const state = getState();
  const shopId = state.shop.shop?.id;
  console.log(state.shop);
  return shopId;
};

export function formatError(errorResponse) {
  switch (errorResponse.error.message) {
    case "EMAIL_EXISTS":
      return "Email already exists";

    case "EMAIL_NOT_FOUND":
      return "Email not found";
    case "INVALID_PASSWORD":
      return "Invalid Password";
    case "USER_DISABLED":
      return "User Disabled";

    default:
      return "";
  }
}
