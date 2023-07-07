import * as yup from "yup";

import { validatePrice } from "./euroToCent";

const validateFeePerKm = () =>
  yup
    .array()
    .of(
      yup.object({
        from: yup
          .number()
          .typeError("Cette valeur doit être un nombre.")
          .required("Le nombre de km est obligatoire.")
          .test(
            "isGreaterThanPreviousTo",
            "La valeur doit être supérieure à la valeur précédente.",
            function (value, context) {
              if (!context?.from) {
                return true;
              }

              const currentLevel = context?.from[0];
              const currentCost = context?.from[1];

              const index = currentCost.value.levels.findIndex(
                (level: any) => level.id === currentLevel.value.id
              );

              if (index === 0) {
                return true;
              }

              const previousLevel = currentCost.value.levels[index - 1];

              if (!value) {
                return true;
              }

              return value == previousLevel.to;
            }
          ),
        to: yup
          .number()
          .typeError("Cette valeur doit être un nombre.")
          .required("Le nombre de km est obligatoire.")
          .test(
            "isGreaterThanFrom",
            "La valeur doit être supérieure à la valeur de départ.",
            function (value) {
              const { from } = this.parent;
              if (from === undefined || from === null) {
                return true;
              }
              if (!value) {
                return false;
              }
              return value > from;
            }
          ),
        delivery: validatePrice(),
        service: validatePrice(),
      })
    )
    .min(1, "Au moins une distance est obligatoire.")
    .default([]);

const validateFeesPerPrice = () =>
  yup
    .array()
    .of(
      yup.object({
        id: yup.string().required(),
        minimumCartPrice: validatePrice(),
        maximumCartPrice: validatePrice(),
        levels: validateFeePerKm(),
      })
    )
    .default([])
    .min(1, "Au moins une tranche prix est obligatoire.")
    .test(
      "uniqueMinimumCartPrice",
      "Le prix minimum doit être unique.",
      function (value) {
        const minimumCartPrices = value.map((item) => item.minimumCartPrice);
        const uniqueMinimumCartPrices = [...new Set(minimumCartPrices)];

        return uniqueMinimumCartPrices.length === minimumCartPrices.length;
      }
    )
    .test(
      "isMinimumCartPriceLessThanMaximumCartPrice",
      "Le prix minimum doit être inférieur au prix maximum.",
      function (value) {
        const minimumCartPrices = value.map((item) => item.minimumCartPrice);
        const maximumCartPrices = value.map((item) => item.maximumCartPrice);

        return minimumCartPrices.every((minimumCartPrice, index) => {
          const maximumCartPrice = maximumCartPrices[index];

          if (!maximumCartPrice) {
            return true;
          }

          return minimumCartPrice < maximumCartPrice;
        });
      }
    )
    .test(
      "isMinimumCartPriceEqualToPreviousMaximumCartPrice",
      "Le prix minimum doit être égale au prix maximum de la tranche précédente.",
      function (value) {
        const minimumCartPrices = value.map((item) => item.minimumCartPrice);
        const maximumCartPrices = value.map((item) => item.maximumCartPrice);

        return minimumCartPrices.every((minimumCartPrice, index) => {
          if (index === 0) {
            return true;
          }

          const previousMaximumCartPrice = maximumCartPrices[index - 1];

          if (!previousMaximumCartPrice) {
            return true;
          }

          return minimumCartPrice == previousMaximumCartPrice;
        });
      }
    );
export const feesSchema = yup.object({
  baseDeliveryFee: validatePrice("Le prix de base est obligatoire."),
  deliveryFeePerKm: validatePrice("Le prix par km est obligatoire."),

  customerFees: validateFeesPerPrice(),

  platformFee: yup
    .number()
    .required("Le pourcentage est obligatoire.")
    .min(0)
    .max(100)
    .typeError("Cette valeur doit être un nombre."),
});

export const customShopFeeSchema = yup.object({
  ...feesSchema.fields,
  useCustomFees: yup.boolean().default(false),
});
