import { OrderState } from "utils/types/OrderState";

export const reducers = {
  handleEditionMode: (state: OrderState) => {
    state.editionMode = !state.editionMode;
  },

  setEditionMode: (state: OrderState, { payload }: { payload: boolean }) => {
    state.editionMode = payload;
  },

  setOrderItems: (state: OrderState, action: any) => {
    state.orderItems = action.payload;
  },
};
