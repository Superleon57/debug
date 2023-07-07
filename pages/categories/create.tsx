import React, { useState } from "react";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Save as SaveIcon } from "@mui/icons-material";

import { Category } from "utils/types/Category";
import { createCategorySchema } from "utils/validation/categorySchema";
import BreacdcrumbsComponent from "components/Breadcrumbs";
import FormSection from "components/FormSection";
import FormInput from "components/FormSection/FormInput";
import UploadImage from "components/UploadImage";
import { client } from "utils/api";
import { showPermanantError, showSuccess } from "utils/toastify";

import classes from "./Categories.module.scss";

const SaveButton = ({
  isLoading = false,
  canSave = true,
}: {
  isLoading?: boolean;
  canSave?: boolean;
}) => {
  return (
    <LoadingButton
      color="info"
      sx={{ mt: 2 }}
      loading={isLoading}
      variant="outlined"
      loadingPosition="start"
      startIcon={<SaveIcon />}
      type="submit"
      disabled={!canSave}
    >
      Enregistrer
    </LoadingButton>
  );
};

const Create = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<Category>({
    resolver: yupResolver(createCategorySchema),
  });
  const { handleSubmit } = methods;

  const fetchCreateCategory = async (data: Category) => {
    try {
      const formdata = new FormData();

      formdata.append("image", data.image);
      formdata.append("name", data.name);

      await client.postFile("/protected/admin/category", formdata);

      showSuccess("Catégorie créée avec succès.");

      router.push("/categories");
    } catch (err) {
      if (err.message) {
        showPermanantError(err.message);
      } else {
        showPermanantError("Une erreur est survenue.");
      }
    }
  };

  const onSubmit = async (data: Category) => {
    setIsLoading(true);
    await fetchCreateCategory(data);
    setIsLoading(false);
  };

  return (
    <Box className={classes.main}>
      <BreacdcrumbsComponent
        paths={[
          { href: "/categories", name: "Catégories" },
          { name: "Nouvelle catégorie" },
        ]}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormSection title="Général">
            <FormInput name="name" label="Titre" value="" />

            <UploadImage title="Image de la catégorie" />
          </FormSection>
          <SaveButton {...{ isLoading }} />
        </form>
      </FormProvider>
    </Box>
  );
};

Create.title = "Nouvelle catégorie";

export default Create;
