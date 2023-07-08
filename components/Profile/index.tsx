import React from "react";
import RoomIcon from "@mui/icons-material/Room";
import { Paper, Stack, Typography } from "@mui/material";

import { useSelector } from "store";
// import { getProfile } from 'store/api/profile';
import { getShop } from "store/reducers/shopSlice";
import ShopImage from "components/ShopImage";

import classes from "./Profile.module.scss";

export default function Profile() {
  // const profile = useSelector(getProfile);;
  const shop = useSelector(getShop);

  return (
    <Paper className={classes.container}>
      <ShopImage currentImage={shop.image} />

      <Stack spacing={2} alignItems="center" sx={{ p: 2 }}>
        <Typography
          variant="h3"
          color="secondary"
          className={classes.shopTitle}
        >
          {shop?.name}
        </Typography>

        <Typography
          variant="body1"
          color="primary"
          className={classes.shopLocation}
        >
          <RoomIcon className={classes.locationIcon} color="secondary" />{" "}
          {shop?.address?.city}
        </Typography>
        <Typography
          variant="body1"
          color="primary"
          className={classes.shopLocation}
        >
          {shop?.address?.address}
        </Typography>
      </Stack>
    </Paper>
  );
}
