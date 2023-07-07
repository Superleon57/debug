import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "store";

const initialState = {
  theme: "light",
  alert: {
    message: "",
    type: "info",
    title: "",
    show: false,
  },
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    themeSwitch: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },

    addAlert: (state, action) => {
      const { title, message, type } = action.payload;
      state.alert = {
        title,
        message,
        type,
        show: true,
      };
    },
    closeAlert: (state) => {
      state.alert.show = false;
    },
  },
});
export const { themeSwitch, addAlert, closeAlert } = appSlice.actions;
export default appSlice.reducer;

export const setAlert =
  ({
    title,
    message,
    type,
    timeout = 3000,
  }: {
    title: string;
    message: string;
    type: string;
    timeout?: number;
  }) =>
  (dispatch: any) => {
    dispatch(addAlert({ title, message, type, timeout }));

    setTimeout(() => dispatch(closeAlert()), timeout);
  };

export const getTheme = (state: RootState) => state.app.theme;
export const getAlert = (state: RootState) => state.app.alert;
