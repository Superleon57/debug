import React from "react";
import { Controller, useFormContext, get } from "react-hook-form";
import {
  Grid,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  Switch,
  TextFieldProps,
  Box,
} from "@mui/material";

import { Category } from "utils/types/Category";

import classes from "./ProductDetails.module.scss";

type ProductDetailsInputArgs = {
  label: string;
  value: string | number | boolean;
  name: string;
  GridSize?: number;
} & TextFieldProps;
export function ProductDetailsInput({
  label,
  value,
  name,
  GridSize = 12,
  ...textFieldProps
}: ProductDetailsInputArgs) {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  const error = get(errors, name);

  return (
    <Grid item xs={GridSize}>
      <InputLabel className={classes.inputLabel}>{label}</InputLabel>
      <Controller
        render={({ field }) => (
          <TextField
            {...field}
            size="small"
            hiddenLabel
            variant="outlined"
            color="info"
            className={classes.input}
            error={!!error}
            helperText={error ? error.message?.toString() : ""}
            {...textFieldProps}
          />
        )}
        name={name}
        control={control}
        defaultValue={value}
      />
    </Grid>
  );
}
export type ProductDetailsSelect = ProductDetailsInputArgs & {
  items: Category[] | [{ [key: string]: string }];
};
export function ProductDetailsSelect({
  label,
  value,
  items,
  name,
}: ProductDetailsSelect) {
  const { control } = useFormContext();

  return (
    <Grid item xs={12}>
      <InputLabel className={classes.inputLabel}>{label}</InputLabel>
      <Controller
        render={({ field }) => (
          <Select {...field} variant="filled" className={classes.input}>
            <MenuItem value="0">Séléctionnez une catégorie</MenuItem>
            {items.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        )}
        name={name}
        control={control}
        defaultValue={value}
      />
    </Grid>
  );
}

export function ProductDetailsSwitch({
  label,
  value,
  name,
}: ProductDetailsInputArgs) {
  const { control } = useFormContext();

  return (
    <Box display="flex" alignItems="center">
      <InputLabel>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={value}
        render={({ field }) => (
          <Switch
            color="secondary"
            onChange={(e) => field.onChange(e.target.checked)}
            checked={field.value}
          />
        )}
      />
    </Box>
  );
}
