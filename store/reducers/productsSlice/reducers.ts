import { ProductsState } from "utils/types/ProductState";

export const reducers = {
  filterByCategory: (state: ProductsState, action: any) => {
    state.filterByCategory = action.payload;
  },
  toggleFilter: (state: ProductsState) => {
    state.showFilter = !state.showFilter;
  },

  selectProduct: (state: ProductsState, action: any) => {
    const productAlreadySelected = state.selectedProducts.find(
      (product) => product.id === action.payload.product.id
    );

    if (productAlreadySelected) {
      state.selectedProducts = state.selectedProducts.filter(
        (product) => product.id !== action.payload.product.id
      );
    }

    if (!productAlreadySelected) {
      state.selectedProducts.push(action.payload.product);
    }
  },

  resetSelectedProducts: (state: ProductsState) => {
    state.selectedProducts = [];
  },
};
