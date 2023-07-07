import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";

import { RootState } from "store";
import { StateStatus } from "utils/types/StateStatus";
import { Order } from "utils/types/Order";
import { OrderStatus } from "utils/enums/OrderStatus";
import {
  showOrderNextStepError,
  showOrderNextStepSuccess,
  showPermanantError,
  showSuccess,
} from "utils/toastify";
import { CancelReasons } from "utils/enums/CancelReasons";
import { OrderValidation } from "utils/validation/orderValidationSchema";

import { client } from "../../utils/api";

type OrdersState = {
  Orders: Order[];
  count: number;
  ordersPerStatus: {
    [key in OrderStatus]: number;
  };
  status: StateStatus;
  ordersItemStatus: StateStatus;
  deliveredOrdersStatus: StateStatus;
  inProgressOrdersStatus: StateStatus;
  updateStatus: StateStatus;
  nextStepStatus: StateStatus;
  error: string | undefined;
};

const initialState: OrdersState = {
  Orders: [],
  count: 0,
  ordersPerStatus: {
    [OrderStatus.ALL]: 0,
    [OrderStatus.PAID]: 0,
    [OrderStatus.ASSIGNED_TO_DELIVERY_MAN]: 0,
    [OrderStatus.WAITING_FOR_DELIVERY_MAN]: 0,
    [OrderStatus.DELIVERY_STARTING]: 0,
    [OrderStatus.DELIVERED]: 0,
    [OrderStatus.CANCELED]: 0,
  },
  status: StateStatus.IDLE,
  ordersItemStatus: StateStatus.IDLE,
  deliveredOrdersStatus: StateStatus.IDLE,
  inProgressOrdersStatus: StateStatus.IDLE,
  nextStepStatus: StateStatus.IDLE,
  updateStatus: StateStatus.IDLE,
  error: "",
};

export const fetchOrders = createAsyncThunk<
  Order[],
  { page?: number; hitsPerPage?: number; status: OrderStatus }
>(
  "orders/all",
  async ({ page = 1, hitsPerPage = 5, status = OrderStatus.ALL }) => {
    const body = {
      payload: {
        page,
        hitsPerPage,
        status: status == OrderStatus.ALL ? undefined : status,
      },
    };

    const response = await client.post("/protected/admin/order/", body);

    const orders = response.data.payload;
    return orders;
  }
);

export const fetchInProgressOrders = createAsyncThunk<
  Order[],
  { page?: number; hitsPerPage?: number }
>("orders/processingOrders", async ({ page = 1, hitsPerPage = 5 }) => {
  const body = {
    payload: {
      page,
      hitsPerPage,
    },
  };
  const response = await client.post("/protected/admin/order/processing", body);

  const orders = response.data.payload;
  return orders;
});

export const fetchDeliveredOrders = createAsyncThunk<
  Order[],
  { limit?: number; offset?: string }
>("orders/delivered", async ({ limit = 5, offset = 0 }) => {
  const body = {
    payload: {
      limit,
      offset,
      status: OrderStatus.DELIVERED,
    },
  };

  const response = await client.post("/protected/admin/order", body);

  const orders = response.data?.payload.orders;
  return orders;
});

export const fetchNextStep = createAsyncThunk(
  "order/fetchNextStep",
  async (order: OrderValidation, { dispatch }) => {
    const { orderId, itemsToCancel } = order;
    const body = {
      payload: {
        orderId,
        itemsToCancel,
      },
    };

    const response = await client.post(`/protected/admin/order/nextStep`, body);

    const { payload } = response.data;

    return payload;
  }
);

const nextStepBuilder = (builder: any) => {
  builder
    .addCase(fetchNextStep.pending, (state: OrdersState) => {
      state.updateStatus = StateStatus.LOADING;
    })
    .addCase(fetchNextStep.fulfilled, (state: OrdersState, action: any) => {
      state.updateStatus = StateStatus.SUCCEEDED;
      state.Orders = state.Orders.map((order) => {
        if (order.id !== action.payload.order.id) {
          return order;
        }

        return { ...order, ...action.payload.order };
      });
      showOrderNextStepSuccess();
    })
    .addCase(fetchNextStep.rejected, (state: OrdersState, action: any) => {
      state.updateStatus = StateStatus.FAILED;
      state.error = action.error.message;
      showOrderNextStepError();
    });
};

export const fetchHoldOrder = createAsyncThunk(
  "order/fetchHoldOrder",
  async (order: Order) => {
    const body = {
      payload: {
        orderId: order.id,
      },
    };

    const response = await client.post(`/protected/admin/order/hold`, body);
    return response.data?.payload;
  }
);

const holdOrderBuilder = (builder: any) => {
  builder
    .addCase(fetchHoldOrder.pending, (state: OrdersState) => {
      state.updateStatus = StateStatus.LOADING;
    })
    .addCase(fetchHoldOrder.fulfilled, (state: OrdersState, action: any) => {
      state.Orders = state.Orders.map((order) => {
        if (order.id !== action.payload.order.id) {
          return order;
        }

        return { ...order, ...action.payload.order };
      });
      showOrderNextStepSuccess();
    })
    .addCase(fetchHoldOrder.rejected, (state: OrdersState, action: any) => {
      state.updateStatus = StateStatus.FAILED;
      state.error = action.error.message;
    });
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.Orders.unshift(action.payload);
      if (!state.Orders.find((o) => o.id === action.payload.id)) {
        state.Orders.unshift(action.payload);
      }
    },
    removeInProgressOrder: (state, action) => {
      state.Orders = state.Orders.filter(
        (order) => order.id !== action.payload
      );
    },

    addDeliveredOrder: (state, action) => {
      state.Orders.unshift(action.payload);
    },

    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.Orders.find((order) => order.id === orderId);
      if (order) {
        order.status = status;
      }
    },
  },
  extraReducers(builder) {
    fetchOrdersBuilder(builder);
    fetchDeliveredOrdersBuilder(builder);
    fetchInProgressOrdersBuilder(builder);
    nextStepBuilder(builder);
    holdOrderBuilder(builder);
    cancelOrderBuilder(builder);
  },
});

export const {
  addOrder,
  removeInProgressOrder,
  addDeliveredOrder,
  updateOrderStatus,
} = ordersSlice.actions;

export default ordersSlice.reducer;

export const getOrders = (state: RootState) => state.orders.Orders;
export const getOrderById = (state: RootState, id: string) =>
  state.orders.Orders.find((order) => order.id === id);
export const getInProgressOrders = createSelector(
  getOrders,
  (orders: Order[]) =>
    orders.filter((order) => order.status !== OrderStatus.DELIVERED)
);

export const getDeliveredOrders = (state: RootState) =>
  state.orders.Orders.filter((order) => order.status === OrderStatus.DELIVERED);

const addOrderIfNotExists = (state: OrdersState, order: Order) => {
  if (!state.Orders.find((o) => o.id === order.id)) {
    state.Orders.push(order);
  }
};

const fetchOrdersBuilder = (builder: any) => {
  builder
    .addCase(fetchOrders.pending, (state: OrdersState) => {
      state.status = StateStatus.LOADING;
    })
    .addCase(fetchOrders.fulfilled, (state: OrdersState, action: any) => {
      const { orders, totalHits, distribution } = action.payload;
      state.Orders = orders;
      state.count = totalHits;
      state.ordersPerStatus = {
        ...distribution,
        all: totalHits,
      };
      state.status = StateStatus.SUCCEEDED;
    });
};

const fetchInProgressOrdersBuilder = (builder: any) => {
  builder
    .addCase(fetchInProgressOrders.pending, (state: OrdersState) => {
      state.inProgressOrdersStatus = StateStatus.LOADING;
    })
    .addCase(
      fetchInProgressOrders.fulfilled,
      (state: OrdersState, action: any) => {
        const { orders } = action.payload;

        orders.forEach((order: Order) => addOrderIfNotExists(state, order));
        state.inProgressOrdersStatus = StateStatus.SUCCEEDED;
      }
    );
};

const fetchDeliveredOrdersBuilder = (builder: any) => {
  builder
    .addCase(fetchDeliveredOrders.pending, (state: OrdersState) => {
      state.deliveredOrdersStatus = StateStatus.LOADING;
    })
    .addCase(
      fetchDeliveredOrders.fulfilled,
      (state: OrdersState, action: any) => {
        action.payload.forEach((order: Order) =>
          addOrderIfNotExists(state, order)
        );
        state.deliveredOrdersStatus = StateStatus.SUCCEEDED;
      }
    );
};

export const fetchCancelOrder = createAsyncThunk(
  "order/fetchCancelOrder",
  async ({ order, reason }: { order: Order; reason: CancelReasons }) => {
    const body = {
      payload: {
        orderId: order.id,
        reason,
      },
    };

    const response = await client.post(`/protected/admin/order/cancel`, body);
    return response.data?.payload;
  }
);

const cancelOrderBuilder = (builder: any) => {
  builder
    .addCase(fetchCancelOrder.pending, (state: OrdersState) => {
      state.updateStatus = StateStatus.LOADING;
    })
    .addCase(fetchCancelOrder.fulfilled, (state: OrdersState, action: any) => {
      state.updateStatus = StateStatus.SUCCEEDED;

      state.Orders = state.Orders.map((order) => {
        if (order.id !== action.payload.order.id) {
          return order;
        }

        return { ...order, ...action.payload.order };
      });

      showSuccess("La commande a bien été annulée");
    })
    .addCase(fetchCancelOrder.rejected, (state: OrdersState, action: any) => {
      state.updateStatus = StateStatus.FAILED;
      state.error = action.error.message;
      showPermanantError("Impossible d'annuler la commande");
    });
};
