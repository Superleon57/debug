import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
} from "react-redux";

import productsReducer from "./reducers/productsSlice/index";
import categoriesReducer from "./api/categories";
import ordersReducer from "./api/orders";
import profileReducer from "./api/profile";
import appReducer from "./reducers/appReducer";
import shopReducer from "./reducers/shopSlice";
import singleProductSlice from "./reducers/singleProductSlice";
import supervisorReducer from "./reducers/supervisorReducer";
import orderReducer from "./reducers/orderReducer";

export const store = configureStore({
  reducer: {
    app: appReducer,
    profile: profileReducer,
    products: productsReducer,
    product: singleProductSlice,
    categories: categoriesReducer,
    orders: ordersReducer,
    shop: shopReducer,
    supervisor: supervisorReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

export const useDispatch = () => useDispatchBase<AppDispatch>();

export const useSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected
): TSelected => useSelectorBase<RootState, TSelected>(selector);

export const getState = () => store.getState();
