import * as yup from "yup";

const requiredString = (message?: string) =>
  yup
    .string()
    .required(message || "Cette valeur est obligatoire")
    .default("");

const itemToCancel = yup.object().shape({
  id: requiredString(),
  quantity: yup.number().integer().min(0).required(),
});

const orderValidationSchema = yup.object().shape({
  orderId: requiredString(),

  itemsToCancel: yup.array().of(itemToCancel),
});

export type OrderValidation = yup.InferType<typeof orderValidationSchema>;

export default orderValidationSchema;
