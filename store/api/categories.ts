import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";

import { RootState } from "store";
import { getShop } from "store/reducers/shopSlice";
import { client } from "utils/api";
import { Category } from "utils/types/Category";
import { Product } from "utils/types/Product";
import { StateStatus } from "utils/types/StateStatus";

type CategoriesState = {
  categories: Category[];
  category: Category | undefined;
  categoryProducts: Product[];
  status: StateStatus;
  error: string | undefined;
};

const initialState: CategoriesState = {
  categories: [],
  category: undefined,
  categoryProducts: [],
  status: StateStatus.IDLE,
  error: "",
};

export const fetchCategories = createAsyncThunk(
  "categories/getAll",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const shop = getShop(state);
    const response = await client.get("/protected/admin/category/" + shop.id);
    return response.data?.payload?.categories;
  }
);

export const fetchCategory = createAsyncThunk(
  "categories/getById",
  async (id: string | string[] | undefined, { getState }) => {
    const state = getState() as RootState;
    const shop = getShop(state);
    const response = await client.get(`/category/${shop.id}/${id}`);
    return response.data?.payload?.category;
  }
);

export const fetchProductByCategoryId = createAsyncThunk(
  "categories/getProductByCategoryId",
  async (categoryId: string | string[] | undefined) => {
    const response = await client.get("/category/products/" + categoryId);
    return response.data?.payload.products;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers(builder) {
    fetchCategoryBuilder(builder);
    fetchCategoriesBuilder(builder);
    fetchProductByCategoryIdBuilder(builder);
  },
});

// export const {} = categoriesSlice.actions;

export default categoriesSlice.reducer;

export const getCategory = (state: RootState) => state.categories.category;

export const getCategories = (state: RootState) =>
  state.categories.categories.filter((category) => category.type === "general");

export const getShopCategories = (state: RootState) =>
  state.categories.categories.filter((category) => category.type === "shop");

export const getEcoFriendlyCategories = (state: RootState) =>
  state.categories.categories.filter(
    (category) => category.type === "eco-friendly"
  );

export const getCategoryProducts = (state: RootState) =>
  state.categories.categoryProducts;

const fetchCategoryBuilder = (
  builder: ActionReducerMapBuilder<CategoriesState>
) => {
  builder
    .addCase(fetchCategory.pending, (state: CategoriesState) => {
      state.status = StateStatus.LOADING;
    })
    .addCase(
      fetchCategory.fulfilled,
      (state: CategoriesState, action: PayloadAction<Category>) => {
        state.category = action.payload;
        state.status = StateStatus.SUCCEEDED;
      }
    );
};

const fetchCategoriesBuilder = (
  builder: ActionReducerMapBuilder<CategoriesState>
) => {
  builder
    .addCase(fetchCategories.pending, (state: CategoriesState) => {
      state.status = StateStatus.LOADING;
    })
    .addCase(
      fetchCategories.fulfilled,
      (state: CategoriesState, action: PayloadAction<Category[]>) => {
        state.status = StateStatus.SUCCEEDED;
        state.categories = action.payload;
      }
    )
    .addCase(fetchCategories.rejected, (state: CategoriesState) => {
      state.status = StateStatus.FAILED;
      // state.error = action.error.message;
    });
};

const fetchProductByCategoryIdBuilder = (
  builder: ActionReducerMapBuilder<CategoriesState>
) => {
  builder
    .addCase(fetchProductByCategoryId.pending, (state: CategoriesState) => {
      state.status = StateStatus.LOADING;
    })
    .addCase(
      fetchProductByCategoryId.fulfilled,
      (state: CategoriesState, action: PayloadAction<Product[]>) => {
        state.status = StateStatus.SUCCEEDED;
        state.categoryProducts = action.payload;
      }
    )
    .addCase(fetchProductByCategoryId.rejected, (state: CategoriesState) => {
      state.status = StateStatus.FAILED;
    });
};
