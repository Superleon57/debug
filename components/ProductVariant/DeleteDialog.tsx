import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { Size, Color } from "utils/types/Product";
import { removeColor, removeSize } from "store/reducers/shopSlice";
import { client } from "utils/api";
import { showSuccess, showPermanantError } from "utils/toastify";
import { useDispatch } from "store";

const DeleteDialog = ({
  variant,
  type,
}: {
  variant: Size | Color;
  type: "color" | "size";
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleRemoveVariant = () => {
    if (type === "color") {
      fetchRemoveColor(variant);
    } else {
      fetchRemoveSize(variant);
    }

    setOpen(false);
  };

  const fetchRemoveColor = async (color: Color) => {
    try {
      await client.delete(`/protected/admin/shop/color/${color.name}`);
      showSuccess("Couleur supprimée avec succès");

      dispatch(removeColor(color));
    } catch (err) {
      showPermanantError("Impossible de supprimer la couleur.");
    }
  };

  const fetchRemoveSize = async (size: Size) => {
    try {
      await client.delete(`/protected/admin/shop/size/${size.name}`);
      showSuccess("Taille supprimée avec succès");

      dispatch(removeSize(size));
    } catch (err) {
      console.log(err);
      showPermanantError("Impossible de supprimer la taille.");
    }
  };

  return (
    <div>
      <IconButton color="primary" size="small" onClick={handleClickOpen}>
        <DeleteIcon fontSize="inherit" color="error" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color="alert">
          Supprimer un variant
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" color="text">
            Êtes vous sûr de vouloir supprimer le variant ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="info">
            Annuler
          </Button>
          <Button onClick={handleRemoveVariant} autoFocus color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteDialog;
