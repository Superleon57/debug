import React from "react";
import { Typography, Box } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const ErrorMessage = ({ errors, field }: { errors: any; field: string }) => {
  return errors?.[field]?.message ? (
    <Box display="flex" alignItems="center" sx={{ mt: 1, ml: 1 }}>
      <ErrorOutlineIcon color="error" />
      <Typography variant="body2" color="error" sx={{ ml: 1 }}>
        {errors?.[field]?.message}
      </Typography>
    </Box>
  ) : null;
};

export default ErrorMessage;
