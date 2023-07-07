import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";

import { useDispatch, useSelector } from "store";
import {
  fetchProductById,
  getProduct,
  getProductStatus,
} from "store/reducers/singleProductSlice";
import { OrderPageSkeleton, ProductDetails } from "components";

import type { Product } from "utils/types/Product";

const Product = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const product = useSelector(getProduct);
  const status = useSelector(getProductStatus);
  const isLoading = status === "loading";

  const { id } = router.query;

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [id]);

  if (isLoading) {
    return <OrderPageSkeleton />;
  }

  if (!product?.id) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography variant="h4">{"Ce produit n'existe pas"}</Typography>
      </Box>
    );
  }

  return <ProductDetails />;
};

Product.title = "Produit";

export default Product;
