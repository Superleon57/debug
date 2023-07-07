import React from "react";
import { Box, Grid, Avatar, Paper, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

import ClientLastOrders from "components/ClientLastOrders";
import { User } from "utils/types/user";
import { customerAvatar } from "utils/avatar";

import classes from "./CustomersDetails.module.scss";

// const headers = ['Commande N°', 'Date', 'Prix', 'Statut', 'Actions'];

const CustomerDetails = ({ customer }: { customer: User }) => {
  return (
    <Paper className={classes.customerDetails}>
      <Grid item xs={12}>
        <Typography className={classes.title}>
          Informations sur le client
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar className={classes.image} {...customerAvatar(customer)} />

          <Typography variant="h4" color="initial" sx={{ mt: 2 }}>
            {customer.firstName} {customer.lastName}
          </Typography>
          <Typography
            variant="body1"
            color="initial"
            sx={{ m: 2 }}
            className={classes.note}
          >
            <StarIcon color="secondary" /> 5.0
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <ClientLastOrders customer={customer} />
      </Grid>
    </Paper>
  );
};

export default CustomerDetails;
