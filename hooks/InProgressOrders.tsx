import { useMemo } from "react";

import { Order } from "utils/types/Order";
import { OrderStatus } from "utils/enums/OrderStatus";
import { getOrders } from "store/api/orders";

import { RootState, useSelector } from "../store";

export const useInProgressOrders = () => {
  const ordersStatus = useSelector((state: RootState) => state.orders.status);
  const isLoading = ordersStatus === "loading";

  const orders = useSelector(getOrders);

  const inProgressOrders = useMemo(
    () =>
      orders.filter((order: Order) => order.status !== OrderStatus.DELIVERED),
    [orders]
  );

  return { inProgressOrders, isLoading };
};
