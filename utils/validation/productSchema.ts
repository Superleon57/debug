import * as yup from "yup";

import { validatePrice } from "./euroToCent";

const requiredString = (message: string) =>
  yup
    .string()
    .required(message || "Cette valeur est obligatoire")
    .default("");

const removeEmptyCategory = (value: string[]) => {
  return value.filter((categoryId: string) => categoryId !== "");
};

const validateVariant = () => {
  return yup.object().shape({
    name: requiredString("Le nom de la variante est obligatoire."),
    value: requiredString("La valeur de la variante est obligatoire."),
  });
};

const productSchema = yup.object().shape({
  title: requiredString("Le titre du produit est obligatoire."),

  description: yup.string().optional().default(""),
  manufacturer: requiredString("La marque du produit est obligatoire."),
  price: validatePrice("Le prix du produit est obligatoire."),
  gender: requiredString("Le genre du produit est obligatoire."),
  material: yup.string().optional().default(""),
  supplierReference: yup.string().optional().default(""),
  storeReference: yup.string().optional().default(""),
  imagesURL: yup.array().min(1, "Vous devez ajouter au moins une image."),

  ecoFriendly: yup.array().optional(),
  hasVariants: yup.boolean().default(false),

  Variants: yup.array().when("hasVariants", {
    is: true,
    then: (schema) =>
      schema
        .of(
          yup.object().shape({
            id: requiredString("L'identifiant de la variante est obligatoire."),

            quantity: yup
              .number()
              .integer()
              .positive()
              .min(0, "Le stock doit être supérieur ou égal à 0.")
              .required("Le stock de la variante est obligatoire.")
              .typeError("Le stock de la variante doit être un nombre."),
            size: validateVariant(),
            color: validateVariant(),
          })
        )
        .min(1, "Vous devez ajouter au moins une variante.")
        .required("Les variants sont obligatoires."),
    otherwise: (schema) => schema.optional(),
  }),

  categories: yup
    .array()
    .transform(removeEmptyCategory)
    .min(1, "Vous devez ajouter au moins une catégorie.")
    .required("Les catégories sont obligatoires."),

  quantity: yup.number().when("hasVariants", {
    is: false,
    then: (schema) =>
      schema
        .required("La quantité est obligatoire.")
        .typeError("La quantité du produit doit être un nombre."),
    otherwise: (schema) =>
      schema
        .transform((value) => (Number.isNaN(value) ? null : value))
        .nullable(),
  }),
});

export default productSchema;
