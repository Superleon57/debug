import {
  Box,
  Grid,
  Card,
  CardHeader,
  Divider,
  CardContent,
} from "@mui/material";
import React from "react";

import { CustomerFees } from "components/CustomerFees";
import { FeeExemple } from "components/FeeExemple";
import {
  MaskedEuroInput,
  PercentInput,
} from "components/FormSection/FormInput";
import { Fees } from "utils/types/Fees";

export const FeeForm = ({ fees }: { fees: Fees }) => {
  return (
    <Box>
      {fees && <FeeExemple fees={fees} />}
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Card sx={{ borderRadius: "10px" }}>
            <CardHeader title="Frais de livraison" />

            <Divider />
            <CardContent sx={{ py: 0 }}>
              <MaskedEuroInput
                label="Base de livraison"
                name="baseDeliveryFee"
              />
              <MaskedEuroInput label="Prix au KM" name="deliveryFeePerKm" />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card sx={{ borderRadius: "10px" }}>
            <CardHeader title="Autre" />

            <Divider />
            <CardContent sx={{ py: 0 }}>
              <PercentInput label="Frais Onlivyou" name="platformFee" />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <CustomerFees />
        </Grid>
      </Grid>
    </Box>
  );
};
