import React, { useEffect, useState, useRef } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import TimelineIcon from "@mui/icons-material/Timeline";
import { Box, Grid } from "@mui/material";

import Card from "components/Card";
import { client } from "utils/api";

import MonthlyChart from "./MonthlyChart";
import DailySales from "./DailySales";
import NewCustomersChart from "./NewCustomersChart";

/* 
TODO : 
- Add sold by category chart
*/
export default function Analytics() {
  const [monthly, setMonthly] = useState(0);
  const [dailyAverage, setDailyAverage] = useState(0);
  const [newCustomers, setNewCustomers] = useState(0);
  const [soldArticles, setSoldArticles] = useState(0);

  const dailySalesRef = useRef(null);
  const monthlySalesRef = useRef(null);
  const newCustomersRef = useRef(null);

  const fetchStatistics = async () => {
    const body = {
      payload: {},
    };

    const result = await client.post("/protected/admin/statistics/", body);

    const { salesByDate, newCustomers, numberOfSales } =
      result.data.payload.sales;

    const monthly =
      salesByDate.reduce((acc, item) => acc + item.total, 0) / 100;
    const average = monthly / salesByDate.length;

    setDailyAverage(average);
    setMonthly(monthly);
    // setDaily(salesByDate.map(item => item.total));
    setNewCustomers(newCustomers);
    setSoldArticles(numberOfSales);
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid sx={{ "& :hover": { cursor: "pointer" } }} item xs={12} md={6}>
          <MonthlyChart ref={monthlySalesRef} />
          <Card
            text="Ce mois-ci"
            icon={<CalendarMonthIcon color="secondary" />}
            value={monthly.toFixed(2) + " €"}
            onClick={monthlySalesRef?.current?.openModal}
          />
        </Grid>
        <Grid sx={{ "& :hover": { cursor: "pointer" } }} item xs={12} md={6}>
          <DailySales ref={dailySalesRef} />
          <Card
            text="CA/Jour"
            icon={<EqualizerIcon color="secondary" />}
            value={dailyAverage.toFixed(2) + " €"}
            onClick={dailySalesRef?.current?.openModal}
          />
        </Grid>
        <Grid sx={{ "& :hover": { cursor: "pointer" } }} item xs={12} md={6}>
          <NewCustomersChart ref={newCustomersRef} />
          <Card
            text="Nouveaux clients"
            icon={<PeopleOutlineIcon color="secondary" />}
            value={newCustomers}
            onClick={newCustomersRef?.current?.openModal}
          />
        </Grid>
        <Grid sx={{ "& :hover": { cursor: "pointer" } }} item xs={12} md={6}>
          <Card
            text="Articles vendus"
            icon={<TimelineIcon color="secondary" />}
            value={soldArticles}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
