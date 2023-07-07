import { createAsyncThunk } from "@reduxjs/toolkit";

import { client } from "utils/api";
import { Product } from "utils/types/Product";
import { showPermanantError, showSuccess } from "utils/toastify";
import { ProductsState } from "utils/types/ProductState";
import { StateStatus } from "utils/types/StateStatus";

export const fetchProducts = createAsyncThunk(
  "products/getProducts",
  async () => {
    const response = await client.get("/protected/admin/product/");
    const products = response.data?.payload.products.map((product: any) => {
      product.price = product.price / 100;
      return product;
    });

    return products;
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (data: Product) => {
    const body = { payload: { ...data } };
    const response = await client.post("/protected/admin/product/new", body);
    return response.data?.payload?.product;
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (data: Product) => {
    const body = { payload: { ...data } };
    const response = await client.patch(
      "/protected/admin/product/" + data.id,
      body
    );
    return response.data?.payload?.product;
  }
);

export const fetchProductById = createAsyncThunk(
  "products/getProductById",
  async (id: string) => {
    const response = await client.get("/protected/admin/product/" + id);
    return response.data?.payload;
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

export const hideProducts = createAsyncThunk(
  "products/hideProducts",
  async (products: Product[]) => {
    const productIds = products.map((product) => product.id);
    const body = { payload: { productIds } };
    const response = await client.post("/protected/admin/product/hide", body);
    return response.data?.payload;
  }
);
export const showProducts = createAsyncThunk(
  "products/showProducts",
  async (products: Product[]) => {
    const productIds = products.map((product) => product.id);
    const body = { payload: { productIds } };
    const response = await client.post("/protected/admin/product/unhide", body);
    return response.data?.payload;
  }
);
export const deleteProducts = createAsyncThunk(
  "products/deleteProducts",
  async (products: Product[]) => {
    const productIds = products.map((product) => product.id);
    const body = { payload: { productIds } };
    const response = await client.post("/protected/admin/product/delete", body);
    return response.data?.payload;
  }
);

const fetchProductsBuilder = (builder: any) => {
  builder
    .addCase(fetchProducts.pending, (state: ProductsState) => {
      state.status = StateStatus.LOADING;
    })
    .addCase(fetchProducts.fulfilled, (state: ProductsState, action: any) => {
      state.status = StateStatus.SUCCEEDED;
      state.products = action.payload;
    })
    .addCase(fetchProducts.rejected, (state: ProductsState, action: any) => {
      state.status = StateStatus.FAILED;
      state.error = action.error.message;
    });
};

const hideProductsBuilder = (builder: any) => {
  builder
    .addCase(hideProducts.pending, (state: ProductsState) => {
      state.actionStatus = StateStatus.LOADING;
    })
    .addCase(hideProducts.fulfilled, (state: ProductsState, action: any) => {
      const productIds = action.payload.updatedProducts.map(
        (product: Product) => product.id
      );

      state.products = state.products.map((product) => {
        if (productIds.includes(product.id)) {
          product.hidden = true;
        }
        return product;
      });

      showSuccess("Les produits ont bien été masqués");

      state.actionStatus = StateStatus.SUCCEEDED;
    })
    .addCase(hideProducts.rejected, (state: ProductsState, action: any) => {
      showPermanantError(
        "Une erreur s'est produite lors du masquage des produits"
      );
      state.actionStatus = StateStatus.FAILED;
    });
};
const showProductsBuilder = (builder: any) => {
  builder
    .addCase(showProducts.pending, (state: ProductsState) => {
      state.actionStatus = StateStatus.LOADING;
    })
    .addCase(showProducts.fulfilled, (state: ProductsState, action: any) => {
      const productIds = action.payload.updatedProducts.map(
        (product: Product) => product.id
      );
      state.products = state.products.map((product) => {
        if (productIds.includes(product.id)) {
          product.hidden = false;
        }
        return product;
      });

      showSuccess("Les produits ont bien été masqués");
      state.actionStatus = StateStatus.SUCCEEDED;
    })
    .addCase(showProducts.rejected, (state: ProductsState, action: any) => {
      showPermanantError(
        "Une erreur s'est produite lors du masquage des produits"
      );
      state.actionStatus = StateStatus.FAILED;
    });
};
const deleteProductsBuilder = (builder: any) => {
  builder
    .addCase(deleteProducts.pending, (state: ProductsState) => {
      state.actionStatus = StateStatus.LOADING;
    })
    .addCase(deleteProducts.fulfilled, (state: ProductsState, action: any) => {
      const productIds = action.payload.deletedProducts.map(
        (product: Product) => product.id
      );
      state.products = state.products.filter(
        (product) => !productIds.includes(product.id)
      );
      showSuccess("Les produits ont bien été supprimés");
      state.actionStatus = StateStatus.SUCCEEDED;
    })
    .addCase(deleteProducts.rejected, (state: ProductsState, action: any) => {
      showPermanantError(
        "Une erreur s'est produite lors de la suppression des produits"
      );
      state.actionStatus = StateStatus.FAILED;
    });
};

const createProductsBuilder = (builder: any) => {
  builder
    .addCase(createProduct.pending, (state: ProductsState) => {
      state.updateStatus = StateStatus.LOADING;
    })
    .addCase(createProduct.fulfilled, (state: ProductsState, action: any) => {
      state.updateStatus = StateStatus.SUCCEEDED;
      state.products.push(action.payload);
    })
    .addCase(createProduct.rejected, (state: ProductsState, action: any) => {
      state.updateStatus = StateStatus.FAILED;
      state.error = action.error.message;
    });
};
const updateProductBuilder = (builder: any) => {
  builder
    .addCase(updateProduct.pending, (state: ProductsState) => {
      state.updateStatus = StateStatus.LOADING;
    })
    .addCase(updateProduct.fulfilled, (state: ProductsState, action: any) => {
      state.updateStatus = StateStatus.SUCCEEDED;
      state.products = state.products.map((product) => {
        if (product.id === action.payload.id) {
          return action.payload;
        }
        return product;
      });
    })
    .addCase(updateProduct.rejected, (state: ProductsState, action: any) => {
      state.updateStatus = StateStatus.FAILED;
      state.error = action.error.message;
    });
};

export const extraReducers = (builder: any) => {
  fetchProductsBuilder(builder);
  createProductsBuilder(builder);
  updateProductBuilder(builder);
  hideProductsBuilder(builder);
  showProductsBuilder(builder);
  deleteProductsBuilder(builder);
};
