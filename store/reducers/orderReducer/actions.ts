import { createAsyncThunk } from "@reduxjs/toolkit";

import { client } from "utils/api";
import { CancelReasons } from "utils/enums/CancelReasons";
import { showPermanantError, showSuccess } from "utils/toastify";
import { Order } from "utils/types/Order";
import { OrderItem } from "utils/types/OrderItem";
import { OrderState } from "utils/types/OrderState";
import { StateStatus } from "utils/types/StateStatus";
import { OrderValidation } from "utils/validation/orderValidationSchema";

export const fetchOrderItems = createAsyncThunk<
  OrderItem[],
  { orderId: string }
>("order/getOrderItems", async ({ orderId }) => {
  const response = await client.get(`/protected/admin/order/items/${orderId}`);

  const items = response.data?.payload.items.map((item: any) => {
    item.price = item.total / 100;
    return item;
  });
  return items;
});

const fetchOrdersItemBuilder = (builder: any) => {
  builder
    .addCase(fetchOrderItems.pending, (state: OrderState) => {
      state.orderItemsStatus = StateStatus.LOADING;
    })
    .addCase(fetchOrderItems.fulfilled, (state: OrderState, action: any) => {
      state.orderItemsStatus = StateStatus.SUCCEEDED;
      state.orderItems = action.payload;
    })
    .addCase(fetchOrderItems.rejected, (state: OrderState, action: any) => {
      state.orderItemsStatus = StateStatus.FAILED;
      state.error = action.error.message;
    });
};

export const extraReducers = (builder: any) => {
  fetchOrdersItemBuilder(builder);
};
