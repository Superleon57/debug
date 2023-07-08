import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  Box,
  TableCell,
  TableRow,
  TableSortLabel,
  Paper,
  TableBody,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useFormContext } from "react-hook-form";

import { Variant } from "utils/types/Product";

import DeleteVariantDialog from "./DeleteVariantDialog";
import EditableCell from "./EditableCell";

const COLUMN_LABELS = {
  color: "Couleur",
  size: "Taille",
  quantity: "Quantité",
  action: "",
};

const columns = [
  {
    id: "color",
    label: COLUMN_LABELS.color,
    disablePadding: false,
    editable: false,
  },
  {
    id: "size",
    label: COLUMN_LABELS.size,
    disablePadding: false,
    editable: false,
  },
  {
    id: "quantity",
    label: COLUMN_LABELS.quantity,
    disablePadding: false,
    editable: true,
    type: "number",
  },
  { id: "action", label: COLUMN_LABELS.action },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    order,
    orderBy,

    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            padding={column.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === column.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : "asc"}
              onClick={createSortHandler(column.id)}
            >
              {column.label}
              {orderBy === column.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function Inventory() {
  const {
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const [hoverIndex, setHoverIndex] = React.useState(-1);

  const updateVariant = ({
    variantId,
    field,
    editedValue,
  }: {
    variantId: string;
    field: string;
    editedValue: string;
  }) => {
    const generatedVariants = getValues("Variants");
    const updatedVariants = generatedVariants.map((variant) => {
      if (variant.id === variantId) {
        variant[field] = editedValue;
      }
      return variant;
    });

    setValue("Variants", updatedVariants);
  };

  const generatedVariants = watch("Variants");

  const handleMouseEnter = (index: number) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(-1);
  };

  return (
    <Paper sx={{ width: "100%", mb: 2 }} elevation={0}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} size="medium">
          <EnhancedTableHead />
          <TableBody>
            {generatedVariants?.map((variant: Variant, index: number) => {
              const variantErrors = errors.Variants?.[index];
              const isHovered = hoverIndex === index;
              return (
                <TableRow
                  hover
                  key={variant.id}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  {columns.map((column, index) => {
                    const value = variant[column.id];
                    const error = variantErrors?.[column.id]?.message;

                    return (
                      <TableCell key={index}>
                        {column.editable && (
                          <EditableCell
                            {...{ variant, column, updateVariant, isHovered }}
                          />
                        )}

                        {column.id === "color" && (
                          <Box display="flex">
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: 1,
                                mr: 1,
                                bgcolor: variant.color.value,
                                boxShadow: "0 1px 3px 0 #000",
                              }}
                            />
                            <Typography variant="body2">
                              {variant.color.name}
                            </Typography>
                          </Box>
                        )}

                        {column.id === "size" && (
                          <Typography variant="body2">
                            {variant.size.name}
                          </Typography>
                        )}

                        {column.id === "action" && (
                          <DeleteVariantDialog {...{ variant, isHovered }} />
                        )}

                        {error && (
                          <Typography variant="caption" color="error">
                            {error}
                          </Typography>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {errors.Variants && (
        <Typography variant="caption" color="error">
          {errors?.Variants?.message}
        </Typography>
      )}
    </Paper>
  );
}
