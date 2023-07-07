import React from "react";
import { Grid } from "@mui/material";

import Analytics from "components/Analytics";
// import Earnings from 'components/Earnings';

export default function Payments() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Analytics />
      </Grid>
      <Grid item xs={12} md={6}>
        {/* <Earnings /> */}
      </Grid>
    </Grid>
  );
}

Payments.title = "Encaissement";
