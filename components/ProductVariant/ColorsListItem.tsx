import React, { useState } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  Box,
  ListItemText,
} from "@mui/material";

import { Color } from "utils/types/Product";

import DeleteDialog from "./DeleteDialog";

type ColorsListItemProps = {
  color: Color;
  labelId: string;
  isChecked: boolean;
  canDelete: boolean;
  handleChecked: (variant: Color) => void;
};

const ColorsListItem = ({
  color,
  labelId,
  isChecked,
  canDelete,
  handleChecked,
}: ColorsListItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <ListItem
      disablePadding
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      secondaryAction={
        isHovered && canDelete && <DeleteDialog variant={color} type="color" />
      }
    >
      <ListItemButton
        role={undefined}
        onClick={() => handleChecked(color)}
        dense
      >
        <ListItemIcon sx={{ alignItems: "center" }}>
          <Checkbox
            edge="start"
            tabIndex={-1}
            disableRipple
            checked={isChecked}
          />
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: 1,
              mr: 1,
              bgcolor: color.value,
              boxShadow: "0 1px 3px 0 #000",
            }}
          />
        </ListItemIcon>
        <ListItemText id={labelId} primary={color.name} />
      </ListItemButton>
    </ListItem>
  );
};

export default ColorsListItem;
