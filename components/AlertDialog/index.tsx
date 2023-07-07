import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type AlertDialogProps = {
  title: string;
  message: string;
  buttonText?: string;
  onAccept: () => void;

  CustomButton?: React.ReactNode;
  acceptButtonTitle?: string;
  cancelButtonTitle?: string;
};

export default function AlertDialog({
  title,
  message,
  buttonText,
  onAccept,
  CustomButton,
  acceptButtonTitle = "Valider",
  cancelButtonTitle = "Annuler",
}: AlertDialogProps) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseAndAccept = () => {
    onAccept();
    setOpen(false);
  };

  return (
    <div>
      {CustomButton ? (
        <div onClick={handleClickOpen}>{CustomButton}</div>
      ) : (
        <Button variant="outlined" onClick={handleClickOpen}>
          {buttonText}
        </Button>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            {cancelButtonTitle}
          </Button>
          <Button onClick={handleCloseAndAccept} color="error">
            {acceptButtonTitle}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
