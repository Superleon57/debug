import { Category } from "./Category";
import { Product } from "./Product";
import { StateStatus } from "./StateStatus";

export type ProductsState = {
  products: Product[];
  showFilter: boolean;
  filterByCategory: Category[];
  selectedProducts: Product[];
  error: string | undefined;

  status: StateStatus;
  updateStatus: StateStatus;
  actionStatus: StateStatus;
};
