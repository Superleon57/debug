import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "store";
import { StateStatus } from "utils/types/StateStatus";

import { client } from "../../utils/api";

import type { User } from "utils/types/user";

type Profile = {
  user: User;
  status: StateStatus;
  error: string;
};

const initialState = {
  user: {},
  status: StateStatus.IDLE,
  error: "",
} as Profile;

export const fetchProfile = createAsyncThunk("user/getProfile", async () => {
  const response = await client.get("/protected/user/profile");
  return response.data?.payload?.profile;
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfile: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = StateStatus.LOADING;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = StateStatus.SUCCEEDED;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = StateStatus.FAILED;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { resetProfile } = profileSlice.actions;

export default profileSlice.reducer;

export const profileLoaded = (state: RootState) =>
  state.profile.status === StateStatus.SUCCEEDED;
export const getProfile = (state: RootState) => state.profile.user;
