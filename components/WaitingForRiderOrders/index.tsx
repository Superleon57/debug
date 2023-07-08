import { Grid, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import classes from "./WaitingForRiderOrders.module.scss";

const OrderCard = () => {
  return (
    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 240 }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Orders
      </Typography>
    </Paper>
  );
};

const WaitingForRiderOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(async () => {
    // const ordersList = await getOrders();
    const ordersList = [1, 2, 3];
    setOrders(ordersList);
  }, []);

  return (
    <Paper className={classes.container}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" color="secondary" sx={{ m: 4 }}>
            Commandes en attente de livreur
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {orders.map((order, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <OrderCard order={order} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default WaitingForRiderOrders;
