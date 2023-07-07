import React from "react";
import { Grid } from "@mui/material";

import Profile from "components/Profile";
import CompletedOrders from "components/CompletedOrders";
import InProgressOrders from "components/InProgressOrders";

export default function Page() {
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item {...{ xs: 12, md: 6, lg: 4 }}>
        <InProgressOrders />
      </Grid>
      <Grid item {...{ xs: 12, md: 6, lg: 4 }}>
        <CompletedOrders />
      </Grid>
      <Grid item {...{ xs: 12, md: 6, lg: 4 }}>
        <Profile />
      </Grid>
    </Grid>
  );
}

Page.title = "Tableau de bord";
