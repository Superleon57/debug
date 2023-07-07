import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "store";
import { client } from "utils/api";
import { StateStatus } from "utils/types/StateStatus";

import type { Product } from "utils/types/Product";
import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (data: Product) => {
    const body = { payload: data };
    const response = await client.post("/protected/admin/product/new", body);
    return response.data?.payload?.product;
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (data: Product) => {
    const body = { payload: data };
    const response = await client.patch(
      "/protected/admin/product/" + data.id,
      body
    );
    return response.data?.payload?.product;
  }
);

export const fetchProductById = createAsyncThunk(
  "products/getProductById",
  async (id: string | string[] | undefined) => {
    const response = await client.get("/protected/admin/product/" + id);

    const product = response.data?.payload?.product;

    if (product) {
      product.price = product.price / 100;
    }

    product.Variants.map((variant) => {
      variant.price = variant.price / 100;
      return variant;
    });

    return product;
  }
);

export const addProductImage = createAsyncThunk<unknown, File>(
  "products/addProductImage",
  async (image: File) => {
    const formdata = new FormData();

    formdata.append("image", image);

    const response = await client.post("/protected/admin/upload/add", formdata);
    return response.data?.payload;
  }
);

type SingleProductState = {
  product: Product;
  status: StateStatus;
  updateStatus: StateStatus;
  error: string | undefined;
};

const initialState: SingleProductState = {
  status: StateStatus.IDLE,
  updateStatus: StateStatus.IDLE,
  product: {} as Product,
  error: undefined,
};

const fetchProductCases = (
  builder: ActionReducerMapBuilder<SingleProductState>
) => {
  return builder
    .addCase(fetchProductById.pending, (state) => {
      state.status = StateStatus.LOADING;
      state.product = {} as Product;
    })
    .addCase(fetchProductById.fulfilled, (state, action) => {
      state.status = StateStatus.SUCCEEDED;
      state.product = action.payload;
    })
    .addCase(fetchProductById.rejected, (state, action) => {
      state.status = StateStatus.FAILED;
      state.error = action.error.message;
    });
};

export const productsSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetSingleProduct: () => initialState,
  },

  extraReducers: (builder) => {
    fetchProductCases(builder);
  },
});

export const { resetSingleProduct } = productsSlice.actions;

export const getProduct = (state: RootState) => state.product.product;
export const getProductStatus = (state: RootState) => state.product.status;

export default productsSlice.reducer;
