import React, { ReactNode } from "react";
import { Box, IconButton, Modal as MuiModal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 850,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const CloseButton = ({ handleClose }: { handleClose: () => void }) => {
  return (
    <IconButton
      color="secondary"
      onClick={handleClose}
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        m: 2,
      }}
    >
      <CloseIcon />
    </IconButton>
  );
};

type ModalProps = {
  children: ReactNode | ReactNode[];
  open: boolean;
  setOpen: (open: boolean) => void;
  style?: React.CSSProperties;
};

const Modal = ({ children, open, setOpen, style }: ModalProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <MuiModal open={open} onClose={handleClose}>
      <Box sx={{ ...ModalStyle, ...style }}>
        <CloseButton handleClose={handleClose} />
        {children}
      </Box>
    </MuiModal>
  );
};

Modal.displayName = "Modal";

export default Modal;
