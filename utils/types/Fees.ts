import { InferType } from "yup";

import { feesSchema, customShopFeeSchema } from "utils/validation/feesSchema";

export type Fees = InferType<typeof feesSchema>;
export type CustomerFee = InferType<typeof feesSchema>["customerFees"][0];
export type CustomShopFee = InferType<typeof customShopFeeSchema>;

export type CalculatedFees = {
  totalDeliveryCost: number;
  deliveryFee: number;
  serviceFee: number;
  totalPrice: number;
  subTotal: number;
  appFee: number;
  onlivyou: number;
  merchant: number;
};
