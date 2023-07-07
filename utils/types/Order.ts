import { OrderStatus } from "utils/enums/OrderStatus";

import { User } from "./user";
import { CalculatedFees } from "./Fees";
import { FirebaseTimestamp } from "./FirebaseTimestamp";

export type Order = {
  id: string;
  status: OrderStatus;
  userId: string;
  creationDate: FirebaseTimestamp;
  orderNumber: string;
  user: User;
  total: number;
  fees: CalculatedFees;
};
