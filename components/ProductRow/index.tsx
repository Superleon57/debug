import React from "react";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { Checkbox, Chip, TableRow, styled } from "@mui/material";
import { VisibilityOff as VisibilityOffIcon } from "@mui/icons-material";
import Link from "next/link";

import { RootState, useSelector, useDispatch } from "store";
import { Product } from "utils/types/Product";
import {
  selectProduct,
  isProductSelected,
  getSelectedProducts,
} from "store/reducers/productsSlice";
import { getCategories, getShopCategories } from "store/api/categories";
import { Category } from "utils/types/Category";
import { showInfo } from "utils/toastify";

import classes from "./ProductRow.module.css";

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#FFFFFF",
    color: "#413e40",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },

  [`&.${tableCellClasses.body}:first-child`]: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  [`&.${tableCellClasses.body}:hover + tr td`]: {
    border: 0,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&": {
    border: 0,
  },
  "&:hover": {
    backgroundColor: "#f4f7f9",
  },
  "&:hover td, &:hover th": {
    border: 0,
  },
  "&:nth-of-type(odd)": {
    backgroundColor: "#FFFFFF",
  },
  "&:nth-of-type(odd):hover": {
    backgroundColor: "#f4f7f9",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const ProductRow = ({ product }: { product: Product }) => {
  const dispatch = useDispatch();
  const maximumSelelectableProducts = 20;

  const productSelected = useSelector((state: RootState) =>
    isProductSelected(state, product.id)
  );

  const selectedProducts = useSelector(getSelectedProducts);

  const categories = useSelector(getCategories);
  const shopCategories = useSelector(getShopCategories);

  const getProductCategories = () => {
    const allCategories = [...categories, ...shopCategories];

    const productCategories = allCategories.filter((category: Category) =>
      product.categories.includes(category.id)
    );

    return productCategories;
  };

  const getProductQuantity = () => {
    if (!product.quantity && !product.hasVariants) {
      return 0;
    }

    if (!product.hasVariants) {
      return product.quantity;
    }

    return product.Variants.reduce((acc, variant) => acc + variant.quantity, 0);
  };

  const handleProductSelection = (product: Product) => {
    if (selectedProducts.length === maximumSelelectableProducts) {
      return showInfo("Vous ne pouvez pas sélectionner plus de produits");
    }
    dispatch(selectProduct({ product }));
  };

  return (
    <StyledTableRow
      key={product.id}
      onClick={() => handleProductSelection(product)}
      className={productSelected ? classes.SelectedProductRow : ""}
    >
      <StyledTableCell padding="checkbox">
        <Checkbox color="primary" checked={productSelected ? true : false} />
      </StyledTableCell>
      <StyledTableCell>
        <img
          src={product.imagesURL[0]}
          alt={product.title}
          loading="eager"
          className={classes.productImage}
        />
      </StyledTableCell>
      <StyledTableCell>
        <Link href={`/products/${product.id}`}>{product.title}</Link>
      </StyledTableCell>
      <StyledTableCell>
        {getProductCategories()
          .slice(0, 3)
          .map((category: Category) => (
            <Chip
              label={category.name}
              key={category.id}
              size="small"
              sx={{ mr: 1 }}
            />
          ))}

        {getProductCategories().length > 3 && (
          <Chip
            label={`+${getProductCategories().length - 3}`}
            size="small"
            sx={{ mr: 1 }}
          />
        )}
      </StyledTableCell>
      <StyledTableCell>{product.price} €</StyledTableCell>
      <StyledTableCell>{getProductQuantity()}</StyledTableCell>
      <StyledTableCell>
        {product.hidden ? <VisibilityOffIcon /> : ""}
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default ProductRow;
