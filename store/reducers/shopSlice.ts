import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { RootState } from "store";
import { client } from "utils/api";
import { showPermanantError, showSuccess } from "utils/toastify";
import { OpeningTime } from "utils/types/openingTime";
import { Color, Size } from "utils/types/Product";
import { Shop } from "utils/types/Shop";
import { StateStatus } from "utils/types/StateStatus";

export const fetchAdminShop = createAsyncThunk(
  "shop/fetchAdminShop",
  async () => {
    const response = await client.get("/protected/admin/shop/");
    return response.data?.payload;
  }
);

export const updateOpeningTime = createAsyncThunk(
  "shop/updateOpeningTime",
  async (data: OpeningTime[]) => {
    const body = { payload: data };
    const response = await client.post(
      "/protected/admin/shop/openingTime",
      body
    );
    return response.data?.payload?.openingTimes;
  }
);

export const updateMessagingToken = createAsyncThunk(
  "shop/updateMessagingToken",
  async (data: string) => {
    const body = { payload: { token: data } };
    const response = await client.patch(
      "/protected/admin/shop/messagingToken",
      body
    );
    return response.data?.payload;
  }
);

export const fetchColors = createAsyncThunk(
  "products/getShopColors",
  async () => {
    const response = await client.get("/protected/admin/shop/colors");
    return response.data?.payload;
  }
);
export const fetchSizes = createAsyncThunk(
  "products/getShopSizes",
  async () => {
    const response = await client.get("/protected/admin/shop/sizes");
    return response.data?.payload;
  }
);

type ShopState = {
  shop: Shop;
  status: StateStatus;
  messagingTokenStatus: StateStatus;
  error: string;
  sizes: Size[];
  colors: Color[];
};

const initialState = {
  shop: {},
  status: StateStatus.IDLE,
  messagingTokenStatus: StateStatus.IDLE,
  error: "",
  sizes: [],
  colors: [],
} as ShopState;

const updateOpeningTimeCases = (
  builder: ActionReducerMapBuilder<ShopState>
) => {
  return builder

    .addCase(updateOpeningTime.pending, () => {
      // state.status = StateStatus.LOADING;
    })
    .addCase(updateOpeningTime.fulfilled, (state, action) => {
      state.shop.openingTimes = action.payload;
      state.status = StateStatus.SUCCEEDED;
      showSuccess("Les horaires d`ouverture ont été mis à jour.");
    })
    .addCase(updateOpeningTime.rejected, (state, action) => {
      // state.status = StateStatus.FAILED;
      state.error = action.error.message || "Something went wrong";
      showPermanantError(
        "Une erreur est survenue lors de la mise à jour des horaires d`ouverture."
      );
    });
};

export const productsSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    updateShopImage: (state, action) => {
      state.shop.image = action.payload;
    },
    updateShopLogo: (state, action) => {
      state.shop.logo = action.payload;
    },
    addColor: (state, action) => {
      state.colors.push(action.payload);
    },
    addSize: (state, action) => {
      state.sizes.push(action.payload);
    },
    removeColor: (state, action) => {
      state.colors = state.colors.filter(
        (color) => color.id !== action.payload.id
      );
    },
    removeSize: (state, action) => {
      console.log("removeSize", action.payload);
      state.sizes = state.sizes.filter((size) => size.id !== action.payload.id);
    },

    resetShop: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchAdminShop.pending, (state) => {
        state.status = StateStatus.LOADING;
      })
      .addCase(fetchAdminShop.fulfilled, (state, action) => {
        state.shop = action.payload.shop;
        state.status = StateStatus.SUCCEEDED;
      })
      .addCase(fetchAdminShop.rejected, (state, action) => {
        state.status = StateStatus.FAILED;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(updateMessagingToken.pending, (state) => {
        state.messagingTokenStatus = StateStatus.LOADING;
      })
      .addCase(updateMessagingToken.fulfilled, (state, action) => {
        state.shop.messagingToken = action.payload.messagingToken;
        state.messagingTokenStatus = StateStatus.SUCCEEDED;
      })
      .addCase(updateMessagingToken.rejected, (state, action) => {
        state.messagingTokenStatus = StateStatus.FAILED;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(fetchColors.fulfilled, (state, action) => {
        state.updateStatus = StateStatus.SUCCEEDED;
        state.colors = action.payload;
      })
      .addCase(fetchSizes.fulfilled, (state, action) => {
        state.updateStatus = StateStatus.SUCCEEDED;
        state.sizes = action.payload;
      });

    updateOpeningTimeCases(builder);
  },
});

export const {
  updateShopImage,
  updateShopLogo,
  addColor,
  addSize,
  removeSize,
  removeColor,
  resetShop,
} = productsSlice.actions;

export const getShop = (state: RootState) => state.shop.shop;
export const getOpeningTimes = (state: RootState) =>
  state.shop.shop?.openingTimes;
export const getMessagingToken = (state: RootState) =>
  state.shop.shop?.messagingToken;
export const shopLoaded = (state: RootState) =>
  state.shop.status === StateStatus.SUCCEEDED;

export const showDisabledShopMessage = (state: RootState) =>
  state.shop.shop.id && state.shop.shop.disabled;

export const getGroupedVariants = (state: RootState) => {
  const variants = state.shop.shop?.variants?.reduce((acc, variant) => {
    const { type } = variant;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(variant);
    return acc;
  }, {} as { [key: string]: any[] });

  return variants;
};

export const getShopColors = (state: RootState): Color[] =>
  state.products?.colors;
export const getShopSizes = (state: RootState): Size[] => state.products?.sizes;

export default productsSlice.reducer;
