import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormContext } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import { Variant } from "utils/types/Product";
import { client } from "utils/api";
import { showSuccess, showPermanantError } from "utils/toastify";
import { useSelector } from "store";
import { getProduct } from "store/reducers/singleProductSlice";

const DeleteVariantDialog = ({
  variant,
  isHovered,
}: {
  variant: any;
  isHovered: boolean;
}) => {
  const { setValue, getValues } = useFormContext();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const product = useSelector(getProduct);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsLoading(false);
  };

  const fetchRemoveVariant = async (variant: Variant) => {
    const body = {
      variantId: variant.id,
      productId: product.id,
    };

    await client.delete(`/protected/admin/variant`, { payload: body });
  };

  const removeVariant = async (variant: Variant) => {
    setIsLoading(true);
    try {
      if (variant.color.id) {
        await fetchRemoveVariant(variant);
      }

      const generatedVariants = (getValues("Variants") as Variant[]) || [];

      const updatedVariants = generatedVariants.filter(
        (v: Variant) => v.id !== variant.id
      );
      setValue("Variants", updatedVariants);
      showSuccess("Variant supprimé avec succès");
    } catch (err) {
      showPermanantError("Impossible de supprimer le variant.");
    }
    handleClose();
  };

  return (
    <div>
      {isHovered && (
        <IconButton color="primary" size="small" onClick={handleClickOpen}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      )}
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
          <LoadingButton loading={isLoading} onClick={handleClose} color="info">
            Annuler
          </LoadingButton>

          <LoadingButton
            loading={isLoading}
            onClick={() => removeVariant(variant)}
            autoFocus
            color="error"
          >
            Supprimer
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteVariantDialog;
