import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";

export default function MultiSelect(args: any) {
  const { title, options, index = "title" } = args;
  return (
    <Box>
      <Autocomplete
        multiple
        limitTags={2}
        options={options}
        getOptionLabel={(option) => option[index]}
        // defaultValue={}
        renderInput={(params) => (
          <TextField {...params} label={title} placeholder={title} />
        )}
        sx={{ width: "300px" }}
        {...args}
      />
    </Box>
  );
}
