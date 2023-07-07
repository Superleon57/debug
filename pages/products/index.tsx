import React, { useEffect, useState } from "react";
import { useSelector, connect } from "react-redux";
import {
  Box,
  Grid,
  Collapse,
  TablePagination,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Sort as SortIcon,
  Delete as DeleteIcon,
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useRouter } from "next/router";

import { RootState, useDispatch } from "store";
import {
  getProducts,
  fetchProducts,
  filterByCategory,
  toggleFilter,
  getSelectedProducts,
  hideProducts,
  showProducts,
  deleteProducts,
  resetSelectedProducts,
} from "store/reducers/productsSlice";
import { fetchCategories, getCategories } from "store/api/categories";
import {
  MultiSelect,
  DataTable,
  ProductRowSkeleton,
  ProductRow,
} from "components";
import AlertDialog from "components/AlertDialog";
import { resetSingleProduct } from "store/reducers/singleProductSlice";

import type { Product } from "utils/types/Product";
import type { Category } from "utils/types/Category";

function FilterProducts() {
  const dispatch = useDispatch();
  const categories = useSelector(getCategories);
  const show = useSelector((state: RootState) => state.products.showFilter);

  const categoriesFilterChange = (event: unknown, newValue: Category[]) => {
    dispatch(filterByCategory(newValue));
  };

  return (
    <Collapse in={show}>
      <Box sx={{ m: 2 }}>
        <MultiSelect
          title="Catégories"
          options={categories}
          onChange={categoriesFilterChange}
          index={"name"}
        />
      </Box>
    </Collapse>
  );
}

function ProductsTable({ products }: { products: Product[] }) {
  const dispatch = useDispatch();

  const productsStatus = useSelector(
    (state: RootState) => state.products.status
  );
  const isProfileLoaded = useSelector(
    (state: RootState) => state.profile.status === "succeeded"
  );
  const isProductsLoading = useSelector(
    (state: RootState) => state.products.status === "loading"
  );

  useEffect(() => {
    if (isProfileLoaded && productsStatus === "idle") {
      dispatch(fetchCategories());
      dispatch(fetchProducts());
    }
  }, [productsStatus, dispatch, isProfileLoaded, products]);

  useEffect(() => {
    dispatch(resetSelectedProducts());
  }, []);

  const headersTitles = [
    "",
    "Image",
    "Titre",
    "Catégories",
    "Prix",
    "Quantité",
  ];

  return (
    <DataTable headers={headersTitles}>
      {!isProductsLoading && products ? (
        products.map((product: Product) => (
          <ProductRow key={product.id} product={product} />
        ))
      ) : (
        <ProductRowSkeleton rowCount={10} />
      )}
    </DataTable>
  );
}

const ProductsToolBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const selectedProducts = useSelector(getSelectedProducts);
  const numSelected = selectedProducts.length;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        // ...(numSelected > 0 && {
        //   bgcolor: (theme) =>
        //     alpha(
        //       theme.palette.primary.main,
        //       theme.palette.action.activatedOpacity
        //     ),
        // }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} sélectionnés
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Liste des produits
        </Typography>
      )}
      {numSelected > 0 ? (
        <>
          <AlertDialog
            title="Afficher"
            message="Êtes vous sûr de vouloir afficher ces produits ?"
            onAccept={() => dispatch(showProducts(selectedProducts))}
            CustomButton={
              <Tooltip title="Afficher">
                <IconButton>
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            }
          />
          <AlertDialog
            title="Masquer"
            message="Êtes vous sûr de vouloir masquer ces produits ?"
            onAccept={() => dispatch(hideProducts(selectedProducts))}
            CustomButton={
              <Tooltip title="Masquer">
                <IconButton>
                  <VisibilityOffIcon />
                </IconButton>
              </Tooltip>
            }
          />
          <AlertDialog
            title="Supprimer"
            message="Êtes vous sûr de vouloir supprimer ces produits ?"
            onAccept={() => dispatch(deleteProducts(selectedProducts))}
            CustomButton={
              <Tooltip title="Supprimer">
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            }
          />
        </>
      ) : (
        <>
          <Tooltip title="Ajouter un produit">
            <IconButton onClick={() => router.push("/products/new")}>
              <AddIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Filtrer">
            <IconButton onClick={() => dispatch(toggleFilter())}>
              <SortIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Toolbar>
  );
};

const Products = ({ products }: { products: Product[] }) => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    dispatch(resetSingleProduct());
  }, []);

  const visibleRows = React.useMemo(
    () => products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, products]
  );

  return (
    <Box sx={{ borderTop: "1px solid #f0f1f8" }}>
      <Grid container sx={{ height: "100%" }}>
        <Grid item xs={12}>
          <Box>
            <ProductsToolBar />
            <FilterProducts />
            <ProductsTable products={visibleRows} />
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={products.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

Products.title = "Produits";

export default connect((state: RootState) => ({
  products: getProducts(state),
}))(Products);
