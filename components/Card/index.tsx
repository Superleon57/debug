import React, { ReactElement } from "react";
import { Paper, Typography, Grid } from "@mui/material";

import classes from "./Card.module.scss";

type Card = {
  icon: ReactElement;
  text: string;
  value: string;
  onClick?: () => void;
};

const Card = ({ icon, text, value, onClick }: Card) => {
  return (
    <Paper className={classes.container} onClick={onClick}>
      <Grid container>
        <Grid item xs={8}>
          <Typography variant="body1" color="secondary">
            {text}
          </Typography>
          <Typography variant="h5" color="text.primary">
            {value}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <div className={classes.icon}>{icon}</div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Card;
