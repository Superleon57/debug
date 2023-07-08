import React, { useState } from "react";
import { Box, TextField, Typography, IconButton } from "@mui/material";
import {
  Edit as EditIcon,
  Done as DoneIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";

import { Variant } from "utils/types/Product";

interface EditableCellProps {
  variant: Variant;
  column: {
    id: keyof Variant | "action";
    label: string;
    disablePadding?: boolean;
    editable?: boolean;
    type?: string;
  };
  updateVariant: (params: {
    variantId: string;
    field: string;
    editedValue: string;
  }) => void;
  isHovered: boolean;
}

const EditableCell = ({
  variant,
  column,
  updateVariant,
  isHovered,
}: EditableCellProps) => {
  const value = variant[column.id];

  const [edition, setEdition] = useState(false);
  const [editedValue, setEditedValue] = useState(value || "");

  const handleEdition = () => {
    setEdition(!edition);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedValue(e.target.value);
  };

  const handleSave = () => {
    updateVariant({ variantId: variant.id, field: column.id, editedValue });
    setEdition(false);
  };

  const cancelEdition = () => {
    setEditedValue(value);
    setEdition(false);
  };

  return (
    <Box display="flex" alignItems="center">
      {edition && (
        <TextField
          size="small"
          type={column.type}
          hiddenLabel
          variant="outlined"
          color="info"
          value={editedValue}
          onChange={handleInputChange}
          autoFocus
        />
      )}
      {!edition && (
        <Typography variant="body2" onClick={handleEdition}>
          {value}
        </Typography>
      )}

      {edition ? (
        <>
          <IconButton
            color="primary"
            size="small"
            onClick={handleSave}
            sx={{ mx: 2 }}
          >
            <DoneIcon fontSize="inherit" color="primary" />
          </IconButton>
          <IconButton color="primary" size="small" onClick={cancelEdition}>
            <ClearIcon fontSize="inherit" />
          </IconButton>
        </>
      ) : (
        isHovered && (
          <IconButton
            color="primary"
            size="small"
            onClick={handleEdition}
            sx={{ mx: 2 }}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
        )
      )}
    </Box>
  );
};

export default EditableCell;
