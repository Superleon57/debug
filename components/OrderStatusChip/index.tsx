import React from "react";
import { Chip } from "@mui/material";
import {
  green,
  grey,
  blue,
  lime,
  orange,
  red,
  yellow,
} from "@mui/material/colors";

import { OrderStatusMessages } from "utils/enums/OrderStatus";

const style: Record<string, any> = {
  chip: {
    fontWeight: "bold",
    borderRadius: "4px",
    fontSize: "14px",
    lineHeight: "1",
    textAlign: "center",
    minWidth: "100px",
  },
  waitingForPayment: {
    backgroundColor: yellow[100],
    color: yellow[800],
  },
  paid: {
    backgroundColor: blue[100],
    color: grey[800],
  },
  failed: {
    backgroundColor: red[100],
    color: red[800],
  },
  assignedToDeliveryMan: {
    backgroundColor: blue[300],
    color: blue[800],
  },
  waitingForDeliveryMan: {
    backgroundColor: lime[100],
    color: lime[800],
  },
  deliveryStarting: {
    backgroundColor: orange[100],
    color: orange[800],
  },
  deliveryProcessing: {
    backgroundColor: orange[100],
    color: orange[800],
  },
  deliveryAlmostArrived: {
    backgroundColor: orange[100],
    color: orange[800],
  },
  deliveryArrived: {
    backgroundColor: green[100],
    color: green[800],
  },
  delivered: {
    backgroundColor: green[100],
    color: green[800],
  },
  canceled: {
    backgroundColor: grey[100],
    color: grey[800],
  },
  timedOut: {
    backgroundColor: grey[100],
    color: grey[800],
  },
};

interface Props {
  status: string;
}

const OrderStatusChip: React.FC<Props> = ({ status }) => {
  return (
    <Chip
      label={OrderStatusMessages[status as keyof typeof OrderStatusMessages]}
      sx={{
        ml: 2,
        ...style.chip,
        ...style[status],
      }}
    />
  );
};

export default OrderStatusChip;
