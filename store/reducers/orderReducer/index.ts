import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "store";
import { StateStatus } from "utils/types/StateStatus";
import { OrderState } from "utils/types/OrderState";
import { OrderItem } from "utils/types/OrderItem";

import { extraReducers } from "./actions";
import { reducers } from "./reducers";

const initialState: OrderState = {
  orderItems: [],
  itemsToCancel: [],
  status: StateStatus.IDLE,
  updateStatus: StateStatus.IDLE,
  orderItemsStatus: StateStatus.IDLE,
  editionMode: false,
  error: undefined,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    ...reducers,

    resetOrder: () => initialState,
  },

  extraReducers: (builder) => extraReducers(builder),
});

export const getOrderItems = (state: RootState) => state.order.orderItems;
export const getItemsToCancel = (state: RootState) => state.order.itemsToCancel;
export const isItemToCancel = (state: RootState, item: OrderItem) =>
  state.order.itemsToCancel.find(
    (i) => i.item.id === item.id && i.quantity > 0
  ) !== undefined;

export const getEditionMode = (state: RootState) => state.order.editionMode;

export const getNumberOfItemsToCancel = (state: RootState) =>
  state.order.itemsToCancel.reduce((acc, item) => acc + item.quantity, 0);

export default orderSlice.reducer;

export const { resetOrder, handleEditionMode, setOrderItems, setEditionMode } =
  orderSlice.actions;
