import React, { Fragment, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Avatar,
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  styled,
  List,
} from "@mui/material";
import moment from "moment";

import { client } from "utils/api";
import OrderProgressBar from "components/OrderProgressBar";
import { OrderStatus } from "utils/enums/OrderStatus";
import { Order } from "utils/types/Order";
import { User } from "utils/types/user";
import { formatDate } from "utils/firebase";

import classes from "./ClientLastOrders.module.scss";

const getCustomerOrders = async (userId: string) => {
  const response = await client.get("/protected/admin/order/" + userId);
  return response.data?.payload?.orders;
};

const OrderRow = ({ order, odd = false }: { order: Order; odd: boolean }) => {
  const ListItemColor = styled(ListItem)({
    backgroundColor: odd ? "" : "#ececec",
    "&:hover": {
      backgroundColor: "#ececec",
      cursor: "pointer",
    },
  });

  const formatedDate = formatDate(order.creationDate);
  const dateFromNow = moment(formatedDate).fromNow();

  return (
    <ListItemColor alignItems="flex-start">
      <ListItemAvatar>
        <Avatar
          src="https://via.placeholder.com/80"
          className={classes.productImage}
        />
      </ListItemAvatar>
      <ListItemText
        sx={{ mb: 2 }}
        primary={"Commande N°" + order.orderNumber}
        secondary={
          <div>
            <Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {dateFromNow}
              </Typography>
            </Fragment>
            {order.status !== OrderStatus.DELIVERED && (
              <OrderProgressBar order={order} />
            )}
          </div>
        }
      />
      <ListItemSecondaryAction>
        <Chip
          label={order.total / 100 + "€"}
          size="small"
          className={classes.priceChip}
        />
      </ListItemSecondaryAction>
    </ListItemColor>
  );
};

const ClientLastOrders = ({ customer }: { customer: User }) => {
  const [orders, setOrders] = React.useState([]);

  useEffect(() => {
    getCustomerOrders(customer.id).then((orders) => setOrders(orders));
  }, [customer]);

  return (
    <Grid container component={Paper} spacing={0}>
      <Grid item xs={12}>
        <Typography variant="h5" color="initial" className={classes.title}>
          Dernières commandes
        </Typography>
      </Grid>

      <List sx={{ width: "100%" }}>
        {orders &&
          orders.map((order, index) => (
            <Grid item xs={12} key={index}>
              <OrderRow order={order} odd={index % 2} />
            </Grid>
          ))}
      </List>
    </Grid>
  );
};

export default ClientLastOrders;
