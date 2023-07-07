import React from "react";
import { Alert, AlertTitle, Box } from "@mui/material";

import { useSelector } from "store";
import { showDisabledShopMessage } from "store/reducers/shopSlice";

const DisabledShopAlert = () => {
  const show = useSelector(showDisabledShopMessage);
  return (
    <Box>
      {show && (
        <Alert severity="warning">
          <AlertTitle>Votre boutique est désactivée.</AlertTitle>
          Merci de contacter le support Onliv you pour finaliser la création.
        </Alert>
      )}
    </Box>
  );
};

export default DisabledShopAlert;
