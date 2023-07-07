import { createSlice } from "@reduxjs/toolkit";

import { Product } from "utils/types/Product";
import { RootState } from "store";
import { ProductsState } from "utils/types/ProductState";
import { StateStatus } from "utils/types/StateStatus";
import { Category } from "utils/types/Category";

import {
  addProductImage,
  createProduct,
  deleteProducts,
  extraReducers,
  fetchProductById,
  fetchProducts,
  hideProducts,
  showProducts,
  updateProduct,
} from "./actions";
import { reducers } from "./reducers";

const initialState: ProductsState = {
  filterByCategory: [],
  showFilter: false,
  selectedProducts: [],
  products: [],
  error: undefined,

  status: StateStatus.IDLE,
  updateStatus: StateStatus.IDLE,

  actionStatus: StateStatus.IDLE,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    ...reducers,

    resetProduct: () => initialState,
  },

  extraReducers: (builder) => extraReducers(builder),
});

export default productsSlice.reducer;
export const {
  selectProduct,
  filterByCategory,
  toggleFilter,
  resetSelectedProducts,
} = productsSlice.actions;

export const getProducts = (state: RootState): Product[] => {
  const products = state.products.products;

  if (state.products.filterByCategory.length > 0) {
    const categoriesIds = state.products.filterByCategory.map(
      (category: Category) => category.id
    );
    return products.filter((product: Product) =>
      categoriesIds.includes(product.default_category)
    );
  }

  return products;
};

export const isProductSelected = (state: RootState, id: string) => {
  return state.products.selectedProducts.find(
    (product: Product) => product.id === id
  );
};

export const getSelectedProducts = (state: RootState) => {
  return state.products.selectedProducts;
};

export {
  fetchProducts,
  createProduct,
  updateProduct,
  fetchProductById,
  addProductImage,
  hideProducts,
  showProducts,
  deleteProducts,
};
