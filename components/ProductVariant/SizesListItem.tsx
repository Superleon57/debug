import React, { useState } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
} from "@mui/material";

import { Size } from "utils/types/Product";

import DeleteDialog from "./DeleteDialog";

type SizesListItemProps = {
  size: Size;
  labelId: string;
  isChecked: boolean;
  canDelete: boolean;
  handleChecked: (variant: Size) => void;
};

const SizesListItem = ({
  size,
  labelId,
  isChecked,
  canDelete,
  handleChecked,
}: SizesListItemProps) => {
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
        isHovered && canDelete && <DeleteDialog variant={size} type="size" />
      }
    >
      <ListItemButton onClick={() => handleChecked(size)} dense>
        <ListItemIcon>
          <Checkbox edge="start" tabIndex={-1} checked={isChecked} />
        </ListItemIcon>
        <ListItemText id={labelId} primary={size.name} />
      </ListItemButton>
    </ListItem>
  );
};

export default SizesListItem;
