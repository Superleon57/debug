import { Fees } from "./Fees";

const centsToEuros = (cents: number, scale = 2) => (cents / 100).toFixed(scale);

const formatLevel = (level: any) => {
  return level.map((fee: any) => ({
    ...fee,
    delivery: centsToEuros(fee.delivery),
    service: centsToEuros(fee.service),
  }));
};

export const formatFees = (fees: Fees) => {
  const {
    baseDeliveryFee,
    deliveryFeePerKm,

    customerFees,
  } = fees;

  const formatedFees = {
    ...fees,
    baseDeliveryFee: centsToEuros(baseDeliveryFee),
    deliveryFeePerKm: centsToEuros(deliveryFeePerKm),

    customerFees: customerFees.map((customerFee: any) => {
      return {
        ...customerFee,
        minimumCartPrice: centsToEuros(customerFee.minimumCartPrice, 0),
        maximumCartPrice: centsToEuros(customerFee.maximumCartPrice, 0),
        levels: formatLevel(customerFee.levels),
      };
    }),
  };

  return formatedFees;
};
