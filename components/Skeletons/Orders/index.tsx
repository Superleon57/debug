import * as React from "react";
import { Box, Grid, Avatar, Skeleton } from "@mui/material";

const OrdersSkeleton = ({ rowCount = 1 }: { rowCount?: number }) => {
  if (rowCount < 1) {
    rowCount = 1;
  }

  return (
    <>
      {[...Array(rowCount)].map((_, index) => {
        return (
          <Box sx={{ m: 2 }} key={index}>
            <Grid container>
              <Grid item container xs={2}>
                <Skeleton variant="circular">
                  <Avatar />
                </Skeleton>
              </Grid>
              <Grid item xs={8}>
                <Grid item>
                  <Skeleton animation="wave" height={20} width="60%" />
                </Grid>

                <Grid item>
                  <Skeleton animation="wave" height={20} width="40%" />
                </Grid>
              </Grid>
              <Grid item xs={2}>
                <Skeleton animation="wave" height={40} width="80%" />
              </Grid>
            </Grid>
          </Box>
        );
      })}
    </>
  );
};

export default OrdersSkeleton;
