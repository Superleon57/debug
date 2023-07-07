import React, { useEffect } from "react";
import Link from "next/link";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Typography, Grid, Paper, Button } from "@mui/material";

import { useDispatch } from "store";
import { fetchDeliveredOrders } from "store/api/orders";
import OrdersList from "components/OrdersList";
import { useCompletedOrders } from "hooks/CompletedOrders";

import classes from "./CompletedOrders.module.scss";

const CompletedOrders = () => {
  const dispatch = useDispatch();
  const { deliveredOrders, isLoading } = useCompletedOrders();

  useEffect(() => {
    dispatch(fetchDeliveredOrders({ limit: 5 }));
  }, []);

  return (
    <Paper className={classes.container}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" color="secondary" sx={{ m: 2 }}>
            Commandes livrées
          </Typography>
        </Grid>

        <OrdersList orders={deliveredOrders} isLoading={isLoading} />

        <Grid
          container
          sx={{ mr: 4 }}
          direction="column"
          alignItems="flex-end"
          justifyContent="flex-end"
        >
          <Link href="/orders" className={classes.link}>
            <Button color="secondary" endIcon={<ArrowRightAltIcon />}>
              Voir tout
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CompletedOrders;
