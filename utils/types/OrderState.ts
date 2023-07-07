import { Timestamp } from "firebase/firestore";

import { OrderStatus } from "utils/enums/OrderStatus";

import { Order } from "./Order";
import { OrderItem } from "./OrderItem";
import { StateStatus } from "./StateStatus";

export type OrderState = {
  orderItems: OrderItem[];
  itemsToCancel: Array<{ quantity: number; item: OrderItem }>;
  status: StateStatus;
  updateStatus: StateStatus;
  orderItemsStatus: StateStatus;
  editionMode: boolean;
  error: string | undefined;
};

type OrderDetails = {
  id: string;
  _firestore_id: string;
  orderNumber: string;
  shopId: string;
  userId: string;
  status: OrderStatus;
  total: number;
  creationDate: Timestamp;
  deliveryAddress: deliveryAddress;
  distance: Distance;
  fees: Fees;
  isAGift: boolean;
  paymentDate: Timestamp;
  paymentResult: PaymentResult;
  user: User;
};

type deliveryAddress = {
  addr1: string;
  addr2: string;
  cp: string;
  ville: string;
  libelle: string;
  position: {
    latitude: number;
    longitude: number;
  };
  updatedAt: Timestamp;
};

type Distance = { distance: string; distanceValue: number; duration: string };

type Fees = {
  appFee: number;
  deliveryFee: number;
  merchant: number;
  onlivyou: number;
  serviceFee: number;
  subTotal: number;
  totalDeliveryCost: number;
  totalPrice: number;
};

type PaymentResult = {
  amount: string;
  auto: string;
  error: string;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  photo: string;
};
