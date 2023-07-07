import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Box, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Save as SaveIcon } from "@mui/icons-material";

import { useDispatch, useSelector } from "store";
import BreacdcrumbsComponent from "components/Breadcrumbs";
import FormSection from "components/FormSection";
import FormInput from "components/FormSection/FormInput";
import UploadImage from "components/UploadImage";
import { updateCategorySchema } from "utils/validation/categorySchema";
import { Category } from "utils/types/Category";
import {
  fetchCategory,
  fetchProductByCategoryId,
  getCategory,
  getCategoryProducts,
} from "store/api/categories";
import { client } from "utils/api";
import { showSuccess, showPermanantError } from "utils/toastify";

import classes from "./Categories.module.scss";

const columns: GridColDef[] = [
  {
    field: "image",
    headerName: "image",
    width: 130,
    renderCell: (params: GridValueGetterParams) => {
      return (
        <img
          src={params.row.imagesURL[0]}
          style={{
            height: "90%",
            width: 130,
            objectFit: "cover",
            borderRadius: 4,
          }}
        />
      );
    },
  },
  { field: "title", headerName: "Titre", width: 130 },
  {
    field: "price",
    headerName: "Prix",
    type: "number",
    width: 90,
    valueGetter: (params: GridValueGetterParams) => `${params.row.price} €`,
  },
];

const customLocaleText = {
  noRowsLabel: "Aucun produit pour cette catégorie",
  MuiTablePagination: {
    labelRowsPerPage: "Lignes par page",
  },
};

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

const Category = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const category = useSelector(getCategory);
  const categoryProducts = useSelector(getCategoryProducts);
  const canEdit = category?.type !== "general";

  const methods = useForm<Category>({
    resolver: yupResolver(updateCategorySchema),
    defaultValues: {
      name: "",
    },
  });
  const { handleSubmit, watch, setValue, formState } = methods;

  useEffect(() => {
    dispatch(fetchCategory(id));
    dispatch(fetchProductByCategoryId(id));
  }, [id, dispatch]);

  const categoryName = watch("name");

  useEffect(() => {
    if (category?.name) {
      setValue("name", category?.name);
    }
  }, [category]);

  const fetchUpdateCategory = async (data: Category) => {
    try {
      const formdata = new FormData();

      if (formState.dirtyFields.image) {
        formdata.append("image", data.image);
      }

      formdata.append("name", data.name);

      await client.patch("/protected/admin/category/" + id, formdata);

      showSuccess("Catégorie modifiée avec succès.");
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
    await fetchUpdateCategory(data);
    setIsLoading(false);
  };

  return (
    <Box className={classes.main}>
      <BreacdcrumbsComponent
        paths={[
          { href: "/categories", name: "Catégories" },
          { name: categoryName || "Nouvelle catégorie" },
        ]}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <FormSection title="Général">
              {!canEdit && (
                <Alert severity="info">
                  Vous ne pouvez pas modifier une catégorie générale.
                </Alert>
              )}
              <FormInput
                name="name"
                label="Titre"
                value={categoryName}
                canEdit={canEdit}
              />

              <UploadImage
                title="Image de la catégorie"
                existingImage={category?.image}
                canEdit={canEdit}
              />
            </FormSection>

            <FormSection title="Produits">
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={categoryProducts}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10]}
                  checkboxSelection
                  rowHeight={80}
                  localeText={customLocaleText}
                />
              </div>
            </FormSection>
          </Grid>
          <SaveButton {...{ isLoading, canSave: canEdit }} />
        </form>
      </FormProvider>
    </Box>
  );
};

export default Category;
