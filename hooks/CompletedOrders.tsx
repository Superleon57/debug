import { useMemo } from "react";

import { Order } from "utils/types/Order";
import { OrderStatus } from "utils/enums/OrderStatus";
import { getOrders } from "store/api/orders";

import { RootState, useSelector } from "../store";

export const useCompletedOrders = () => {
  const deliveredOrdersStatus = useSelector(
    (state) => state.orders.deliveredOrdersStatus
  );

  const isLoading = deliveredOrdersStatus === "loading";

  const orders = useSelector(getOrders);

  const deliveredOrders = useMemo(
    () =>
      orders.filter((order: Order) => order.status === OrderStatus.DELIVERED),
    [orders]
  );

  return { deliveredOrders, isLoading };
};
