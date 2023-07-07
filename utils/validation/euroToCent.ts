import * as yup from "yup";

export const transformEuroToCent = (value: number, originalValue: number) => {
  if (originalValue !== undefined && originalValue !== null) {
    return Math.round(value * 100);
  }
  return Math.round(value);
};

export const validatePrice = (message = "") =>
  yup
    .number()
    .positive()
    .min(0, "Le prix doit être supérieur ou égal à 0.")
    .required(message || "Cette valeur est obligatoire")
    .typeError("Cette valeur doit être un nombre.")
    .transform(transformEuroToCent);
