import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "store";
import { client } from "utils/api";
import { StateStatus } from "utils/types/StateStatus";
import { Shop } from "utils/types/Shop";
import { showPermanantError, showSuccess } from "utils/toastify";

import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";

export const fetchShopList = createAsyncThunk(
  "supervisor/shopList",
  async () => {
    const response = await client.get("/protected/supervisor/shops");
    return response.data?.shops;
  }
);

export const updateShopStatus = createAsyncThunk(
  "supervisor/updateShopStatus",
  async ({ shopId, disabled }: { shopId: string; disabled: boolean }) => {
    const payload = {
      shopId,
      disabled,
    };
    const response = await client.post(
      `/protected/supervisor/shop/updateStatus`,
      { payload }
    );
    return response.data?.payload;
  }
);

type SupervisorState = {
  shops: Shop[];
  status: StateStatus;
  updateStatus: StateStatus;
  error: string | undefined;
};

const initialState: SupervisorState = {
  status: StateStatus.IDLE,
  updateStatus: StateStatus.IDLE,
  shops: [] as Shop[],
  error: undefined,
};

const fetchShopListCases = (
  builder: ActionReducerMapBuilder<SupervisorState>
) => {
  return builder
    .addCase(fetchShopList.pending, (state) => {
      state.status = StateStatus.LOADING;
    })
    .addCase(fetchShopList.fulfilled, (state, action) => {
      state.status = StateStatus.SUCCEEDED;
      state.shops = action.payload;
    })
    .addCase(fetchShopList.rejected, (state, action) => {
      state.status = StateStatus.FAILED;
      state.error = action.error.message;
    });
};

const updateShopStatusCases = (
  builder: ActionReducerMapBuilder<SupervisorState>
) => {
  return builder
    .addCase(updateShopStatus.pending, (state) => {
      state.updateStatus = StateStatus.LOADING;
    })
    .addCase(updateShopStatus.fulfilled, (state, action) => {
      state.updateStatus = StateStatus.SUCCEEDED;
      state.shops = state.shops.map((shop) => {
        if (shop.id === action?.payload?.id) {
          shop.disabled = action?.payload?.disabled;
          return shop;
        }
        return shop;
      });

      showSuccess("Le statut de la boutique a été mis à jour avec succès.");
    })
    .addCase(updateShopStatus.rejected, (state, action) => {
      state.updateStatus = StateStatus.FAILED;
      state.error = action.error.message;

      if (action.error?.message) {
        showPermanantError(action.error?.message);
        return;
      }

      showPermanantError(
        "Une erreur est survenue lors de la mise à jour du statut de la boutique."
      );
    });
};

export const supervisorSlice = createSlice({
  name: "supervisor",
  initialState,
  reducers: {
    resetSupervisor: () => initialState,
  },

  extraReducers: (builder) => {
    fetchShopListCases(builder);
    updateShopStatusCases(builder);
  },
});

export const { resetSupervisor } = supervisorSlice.actions;

export const getShops = (state: RootState) => state.supervisor.shops;
export const getUpdateShopStatus = (state: RootState) =>
  state.supervisor.updateStatus;

export default supervisorSlice.reducer;
