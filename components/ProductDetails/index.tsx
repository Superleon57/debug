import React, { useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Box, Grid, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { AddBox, Save as SaveIcon } from "@mui/icons-material";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";

import { updateProduct, createProduct } from "store/reducers/productsSlice";
import { getProduct } from "store/reducers/singleProductSlice";
import {
  getCategories,
  getShopCategories,
  getEcoFriendlyCategories,
  fetchCategories,
} from "store/api/categories";
import { setAlert } from "store/reducers/appReducer";
import ImagesList from "components/ImagesList";
import { Product } from "utils/types/Product";
import { RootState, useDispatch, useSelector } from "store";
import FormSection from "components/FormSection";
import BreacdcrumbsComponent from "components/Breadcrumbs";
import ErrorMessage from "components/ErrorMessage";
import productSchema from "utils/validation/productSchema";
import {
  FlatNumberInput,
  MaskedEuroInput,
} from "components/FormSection/FormInput";

import classes from "./ProductDetails.module.scss";
import {
  ProductDetailsInput,
  ProductDetailsSwitch,
} from "./ProductDetailsInput";
import InventoryModal from "./InventoryModal";
import Inventory from "./Inventory";
import Categories from "./Categories";
import GenderSelect from "./GenderSelect";

const SaveButton = ({
  isUpdateLoading,
  canSave = true,
}: {
  isUpdateLoading: boolean;
  canSave?: boolean;
}) => {
  return (
    <LoadingButton
      color="info"
      sx={{ mt: 2 }}
      loading={isUpdateLoading}
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

function ProductDetails() {
  const dispatch = useDispatch();
  const router = useRouter();

  const product = useSelector(getProduct);
  const categories = useSelector(getCategories);
  const shopCategories = useSelector(getShopCategories);
  const ecoFriendlyCategories = useSelector(getEcoFriendlyCategories);

  const methods = useForm<Product>({
    resolver: yupResolver(productSchema),
  });

  const {
    handleSubmit,
    reset,
    watch,
    register,
    formState: { errors },
  } = methods;

  const title = watch("title", "Nouveau produit");
  const hasVariants = watch("hasVariants", false);

  const isUpdateLoading = useSelector(
    (state: RootState) => state.products.updateStatus === "loading"
  );
  const inventoryModalRef = useRef(null);

  useEffect(() => {
    register("imagesURL", { value: [] });
    register("categories", { value: [] });
    register("Variants", { value: product.Variants });
    dispatch(fetchCategories());

    reset(product);
  }, [product, reset]);

  const onSubmit = (data: Product) => {
    if (product.id) {
      data.id = product.id;
      dispatch(updateProduct(data)).then((res) => {
        if (res.meta.requestStatus === "rejected") {
          dispatch(
            setAlert({
              title: "Une erreur s'est produite",
              message: "Le produit n'a pas pu etre mit à jour",
              type: "error",
            })
          );
          return;
        }
        dispatch(
          setAlert({
            title: "Success",
            message: "Le produit a été mit à jour",
            type: "success",
          })
        );
      });
      return;
    }
    dispatch(createProduct(data)).then((res) => {
      if (res.meta.requestStatus === "rejected") {
        dispatch(
          setAlert({
            title: "Une erreur s'est produite",
            message: "Le produit n'a pas pu etre créé",
            type: "error",
          })
        );
        return;
      }

      dispatch(
        setAlert({
          title: "Success",
          message: "Le produit a été créé",
          type: "success",
        })
      );
      router.push(`/products/${res.payload.id}`);
    });
  };

  return (
    <Box className={classes.productDetails}>
      <BreacdcrumbsComponent
        paths={[{ href: "/products", name: "Produits" }, { name: title }]}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <h2>{title}</h2>

            <SaveButton {...{ isUpdateLoading }} />
          </Box>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item md={12} lg={9} container spacing={3}>
              <FormSection title="Images">
                <ImagesList existingImages={product?.imagesURL} />
                <ErrorMessage errors={errors} field="imagesURL" />
              </FormSection>

              <FormSection title="Détails du produit">
                <ProductDetailsInput
                  name="title"
                  label="Titre"
                  value={product.title}
                />
                <ProductDetailsInput
                  name="description"
                  label="Description"
                  value={product.description}
                  multiline={true}
                  rows={4}
                />
                <ProductDetailsInput
                  name="manufacturer"
                  label="Marque"
                  value={product.manufacturer}
                  GridSize={6}
                />
                <ProductDetailsInput
                  name="material"
                  label="Matière"
                  value={product.material}
                  GridSize={6}
                />
                <ProductDetailsInput
                  name="supplierReference"
                  label="Référence fournisseur"
                  value={product.material}
                  GridSize={6}
                />
                <ProductDetailsInput
                  name="storeReference"
                  label="Référence magasin"
                  value={product.material}
                  GridSize={6}
                />
              </FormSection>

              <FormSection title="Prix">
                <MaskedEuroInput name="price" label="Prix" />
              </FormSection>

              <FormSection title="Inventaire">
                <ProductDetailsSwitch
                  value={product.hasVariants}
                  name="hasVariants"
                  label="Le produit a des déclinaisons"
                />

                {hasVariants ? (
                  <>
                    <Inventory />
                    <InventoryModal ref={inventoryModalRef} />
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<AddBox />}
                      sx={{ mt: 2 }}
                      onClick={inventoryModalRef?.current?.openModal}
                    >
                      Ajouter
                    </Button>
                  </>
                ) : (
                  <FlatNumberInput
                    name="quantity"
                    label="Nombre d'articles en stock"
                  />
                )}
              </FormSection>
            </Grid>

            <Grid item md={12} lg={3} container spacing={3}>
              <FormSection title="Genre">
                <GenderSelect />
              </FormSection>
              <FormSection title="Catégories">
                <Categories
                  categories={[...categories, ...shopCategories]}
                  field="categories"
                />
                <ErrorMessage errors={errors} field="categories" />
              </FormSection>
              <FormSection title="Filtre écoresponsable">
                <Categories
                  categories={ecoFriendlyCategories}
                  field="ecoFriendly"
                />
                <ErrorMessage errors={errors} field="ecoFriendly" />
              </FormSection>
            </Grid>
          </Grid>

          <SaveButton {...{ isUpdateLoading }} />
        </form>
      </FormProvider>
    </Box>
  );
}

export default ProductDetails;
