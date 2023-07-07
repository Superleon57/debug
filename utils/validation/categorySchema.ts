import * as yup from "yup";

export const createCategorySchema = yup.object().shape({
  name: yup
    .string()
    .max(100, "Le titre de la catégorie doit faire 100 caractères maximum.")
    .required("Le titre de la catégorie est obligatoire."),
  image: yup
    .mixed()
    .required("L'image de la catégorie est obligatoire.")
    .test(
      "fileSize",
      "L'image doit faire moins de 2 Mo.",
      (value) => value && value.size <= 2 * 1024 * 1024
    )
    .test(
      "fileType",
      "L'image doit être un fichier jpeg, png ou jpg.",
      (value) =>
        value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
    ),
});

export const updateCategorySchema = yup.object().shape({
  name: yup
    .string()
    .max(100, "Le titre de la catégorie doit faire 100 caractères maximum.")
    .required("Le titre de la catégorie est obligatoire."),
  image: yup
    .mixed()
    .required("L'image de la catégorie est obligatoire.")
    .test("fileSize", "L'image doit faire moins de 2 Mo.", (value) => {
      if (typeof value === "string") {
        return true;
      }
      return value && value.size <= 2 * 1024 * 1024;
    })
    .test(
      "fileType",
      "L'image doit être un fichier jpeg, png ou jpg.",
      (value) => {
        if (typeof value === "string") {
          return true;
        }
        return (
          value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
        );
      }
    ),
});
