import { Product } from "./Product";

export type OrderItem = {
  id: string;
  shopId: string;
  price: number;
  creationDate: Date;
  productId: string;
  detail: Product;
  quantity: number;
  canceledQuantity?: number;
};
