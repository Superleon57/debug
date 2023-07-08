import React from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MenuItem } from "@mui/material";
import { useFormContext } from "react-hook-form";

import ErrorMessage from "components/ErrorMessage";

const GenderSelect = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const gender = watch("gender");

  const handleChange = (event: SelectChangeEvent) => {
    setValue("gender", event.target.value);
  };

  return (
    <>
      <Select
        value={gender}
        onChange={handleChange}
        size="small"
        variant="outlined"
        color="info"
        fullWidth
        error={!!errors.gender}
      >
        <MenuItem value="all">Tout</MenuItem>
        <MenuItem value="man">Homme</MenuItem>
        <MenuItem value="woman">Femme</MenuItem>
        <MenuItem value="boy">Enfant : Garçon</MenuItem>
        <MenuItem value="girl">Enfant : Fille</MenuItem>
      </Select>

      <ErrorMessage field="gender" errors={errors} />
    </>
  );
};

export default GenderSelect;
