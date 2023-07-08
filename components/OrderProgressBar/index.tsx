import { styled, Box } from "@mui/material";
import React from "react";

import { ProgressBarStatuses } from "utils/enums/OrderStatus";
import { Order } from "utils/types/Order";

const steps = Object.keys(ProgressBarStatuses);

const Progress = styled("ul")(() => ({
  counterReset: "step",
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
}));

const Step = styled("li")<{
  ownerState?: { active?: boolean };
}>(({ theme, ownerState }) => ({
  float: "left",
  width: steps.length > 0 ? `${100 / steps.length}%` : "100%",
  position: "relative",
  textAlign: "center",
  margin: "0 5px 5px 5px",

  "&:before": {
    content: '""',
    width: "100%",
    height: "8px",
    lineHeight: "30px",
    borderRadius: "20px",
    border: "2px solid #ddd",
    display: "block",
    textAlign: "center",
    backgroundColor: ownerState?.active
      ? theme.palette.secondary.main
      : "white",
  },
}));

const OrderProgressBar = ({ order }: { order: Order }) => {
  const statusIndex = steps.indexOf(order.status);

  return (
    <Box sx={{ width: "100%", position: "absolute", right: 0, bottom: 0 }}>
      <Progress>
        {Object.keys(ProgressBarStatuses).map((label, index) => (
          <Step key={label} ownerState={{ active: index <= statusIndex }} />
        ))}
      </Progress>
    </Box>
  );
};

export default OrderProgressBar;
