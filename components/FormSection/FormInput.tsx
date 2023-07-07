import React from "react";
import { Controller, useFormContext, get } from "react-hook-form";
import {
  Box,
  InputAdornment,
  InputLabel,
  Switch,
  TextField,
} from "@mui/material";
import { IMaskMixin } from "react-imask";

import { euroMask, flatNumberMask } from "utils/InputMasks";

import classes from "./FormSection.module.scss";

type BaseInputProps = {
  label: string;
  value?: string | number;
  name: string;
};

type FormInputProps = BaseInputProps & {
  canEdit?: boolean;
  inputProps?: Record<string, unknown>;
  mask?: any;
};

const FormInput = ({
  label,
  value = "",
  name,
  canEdit = true,
  inputProps,
}: FormInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name);

  return (
    <>
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
            InputProps={{ ...inputProps }}
            disabled={!canEdit}
          />
        )}
        name={name}
        control={control}
        defaultValue={value}
      />
    </>
  );
};

type FormSwitchProps = {
  label: string;
  value: boolean;
  name: string;
};

export function FormSwitch({ label, value, name }: FormSwitchProps) {
  const { control } = useFormContext();

  return (
    <>
      <InputLabel className={classes.inputLabel}>{label}</InputLabel>
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
    </>
  );
}

type FormNumberInputProps<TInput, TOutput> = FormInputProps & {
  transform: {
    input: (value: TOutput) => TInput;
    output: (value: React.ChangeEvent<HTMLInputElement>) => TOutput;
  };
};

const FormNumberInput = <TInput extends string, TOutput>({
  label,
  value = "",
  name,
  canEdit = true,
  inputProps,
  transform,
}: FormNumberInputProps<TInput, TOutput>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name);

  return (
    <>
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
            InputProps={{ ...inputProps }}
            disabled={!canEdit}
            onChange={(e) => field.onChange(transform.output(e))}
            value={transform.input(field.value)}
          />
        )}
        name={name}
        control={control}
        defaultValue={value}
      />
    </>
  );
};

export const EuroInput = ({
  label,
  value = "",
  name,
  canEdit = true,
  inputProps,
}: FormInputProps) => {
  return (
    <FormNumberInput
      label={label}
      name={name}
      value={value}
      canEdit={canEdit}
      inputProps={{
        endAdornment: <InputAdornment position="end">€</InputAdornment>,
        ...inputProps,
      }}
      transform={{
        input: (value) => {
          return isNaN(value) || value === 0 ? "" : value.toString();
        },
        output: (e) => {
          return e.target.value;
        },
      }}
    />
  );
};

export const KmInput = ({
  label,
  value = "",
  name,
  canEdit = true,
  inputProps,
}: FormInputProps) => {
  return (
    <FormNumberInput
      label={label}
      name={name}
      value={value}
      canEdit={canEdit}
      inputProps={{
        endAdornment: <InputAdornment position="end">Km</InputAdornment>,
        ...inputProps,
      }}
      transform={{
        input: (value) => {
          return isNaN(value) || value.toString();
        },
        output: (e) => {
          return e.target.value;
        },
      }}
    />
  );
};

export const PercentInput = ({
  label,
  value = "",
  name,
  canEdit = true,
  inputProps,
}: FormInputProps) => {
  return (
    <FormInput
      label={label}
      name={name}
      value={value}
      canEdit={canEdit}
      inputProps={{
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
        ...inputProps,
      }}
    />
  );
};

const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
  <TextField {...props} inputRef={inputRef} />
));

export const CustomMaskedInput = ({
  label,
  name,
  canEdit = true,
  inputProps,
  mask,
}: FormInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name);

  return (
    <Box width="100%">
      <InputLabel className={classes.inputLabel}>{label}</InputLabel>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const defaultValue = field.value?.toString();

          return (
            <MaskedInput
              {...field}
              size="small"
              hiddenLabel
              variant="outlined"
              color="info"
              className={classes.input}
              error={!!error}
              helperText={error ? error.message?.toString() : ""}
              InputProps={{
                ...inputProps,
              }}
              disabled={!canEdit}
              mask={mask}
              value={defaultValue}
              onAccept={(value, maskRef) => {
                console.log(maskRef.unmaskedValue);
                field.onChange(maskRef.unmaskedValue);
              }}
            />
          );
        }}
      />
    </Box>
  );
};

export const MaskedEuroInput = ({
  label,
  value = "",
  name,
  scale = 2,
}: BaseInputProps & { scale?: number }) => {
  return (
    <CustomMaskedInput
      label={label}
      name={name}
      value={value}
      mask={[euroMask(scale)]}
      inputProps={{
        endAdornment: <InputAdornment position="end">€</InputAdornment>,
      }}
    />
  );
};

export const FlatNumberInput = ({
  label,
  value = "",
  name,
}: BaseInputProps) => {
  return (
    <CustomMaskedInput
      label={label}
      name={name}
      value={value}
      mask={[flatNumberMask]}
    />
  );
};

export default FormInput;
