import React, { useEffect } from "react";
import Link from "next/link";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Typography, Grid, Paper, Button } from "@mui/material";

import { useDispatch } from "store";
import { fetchInProgressOrders } from "store/api/orders";
import OrdersList from "components/OrdersList";
import { useInProgressOrders } from "hooks/InProgressOrders";

import classes from "./InProgressOrders.module.scss";

const InProgressOrders = () => {
  const dispatch = useDispatch();

  const { inProgressOrders, isLoading } = useInProgressOrders();

  useEffect(() => {
    dispatch(fetchInProgressOrders({ limit: 5 }));
  }, []);

  return (
    <Paper className={classes.container}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" color="secondary" sx={{ m: 2 }}>
            Commandes en cours
          </Typography>
        </Grid>

        <OrdersList orders={inProgressOrders} isLoading={isLoading} />

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

export default InProgressOrders;
