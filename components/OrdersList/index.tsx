import React, { Fragment, useRef } from "react";
import {
  Avatar,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import moment from "moment";

import { formatDate } from "utils/firebase";
import OrdersSkeleton from "components/Skeletons/Orders";
import { Order } from "utils/types/Order";
import { customerAvatar } from "utils/avatar";
import OrderModal from "components/OrderModal";
import OrderProgressBar from "components/OrderProgressBar";
import { OrderStatus } from "utils/enums/OrderStatus";
import { formatCurrency } from "utils/currency";

import classes from "./OrdersList.module.scss";

const OrderDetail = ({
  odd,
  order,
  openModal,
}: {
  order: Order;
  odd: boolean;
  openModal: any;
}) => {
  const fullName = `${order.user.lastName} ${order.user.firstName}`;

  const ListItemColor = styled(ListItem)({
    backgroundColor: odd ? "" : "#ececec",
    "&:hover": {
      backgroundColor: "#ececec",
      cursor: "pointer",
    },
  });

  const formatedPrice = formatCurrency(order.total);
  const formatedDate = formatDate(order.creationDate);
  const dateFromNow = moment(formatedDate).fromNow();

  return (
    <ListItemColor alignItems="flex-start" onClick={() => openModal(order.id)}>
      <ListItemAvatar>
        <Avatar
          className={classes.ProfileImage}
          {...customerAvatar(order.user)}
        />
      </ListItemAvatar>
      <ListItemText
        sx={{ mb: 2 }}
        primary={"N°" + order.orderNumber}
        secondary={
          <Fragment>
            <Typography
              sx={{ display: "inline" }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {dateFromNow}
            </Typography>
            {` - ${fullName}`}
          </Fragment>
        }
      />
      {order.status !== OrderStatus.DELIVERED && (
        <OrderProgressBar order={order} />
      )}
      <ListItemSecondaryAction>
        <Chip
          label={formatedPrice}
          size="small"
          className={classes.priceChip}
        />
      </ListItemSecondaryAction>
    </ListItemColor>
  );
};

type OrdersListProps = { orders: Order[]; isLoading: boolean };

const OrdersList = ({ orders, isLoading }: OrdersListProps) => {
  const orderModalRef = useRef(null) as any;
  const rowsOnNewOrder = 1;
  const rowsOnLoading = 5;
  const skeletonRowCount = orders?.length > 0 ? rowsOnNewOrder : rowsOnLoading;

  return (
    <Grid container>
      <OrderModal ref={orderModalRef} />

      <Grid item xs={12}>
        {isLoading && <OrdersSkeleton rowCount={skeletonRowCount} />}
        {!isLoading && orders?.length === 0 && (
          <Typography
            variant="h6"
            component="h2"
            color="#918f8f"
            sx={{ ml: 4, mb: 2, textAlign: "center" }}
          >
            Aucune commande pour le moment
          </Typography>
        )}

        <List sx={{ width: "100%" }}>
          {orders &&
            orders?.map((order: any, index: number) => {
              const isOdd = index % 2 === 1;
              return (
                <OrderDetail
                  order={order}
                  key={order.id}
                  odd={isOdd}
                  openModal={orderModalRef?.current?.openModal}
                />
              );
            })}
        </List>
      </Grid>
    </Grid>
  );
};

export default OrdersList;
