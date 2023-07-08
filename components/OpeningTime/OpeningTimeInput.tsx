import { Box, InputLabel, OutlinedInput } from "@mui/material";
import React from "react";
import { Control, FieldPath, FieldValues, Controller } from "react-hook-form";

import classes from "./OpeningTime.module.scss";

type SettingsInputProps = {
  label: string;
  value?: string;
  control: Control<any>;
  name: FieldPath<FieldValues>;
  hidden?: boolean;
  checked?: boolean;
};

const OpeningTimeInput = ({
  label,
  value,
  control,
  name,
}: SettingsInputProps) => {
  return (
    <Box display="flex" flexDirection="column">
      <InputLabel className={classes.inputLabel}>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={value}
        render={({ field }) => (
          <OutlinedInput
            {...field}
            className={classes.input}
            type="time"
            inputProps={{ step: 300 }}
            sx={{ width: 200, mr: 1 }}
          />
        )}
      />
    </Box>
  );
};

export default OpeningTimeInput;
