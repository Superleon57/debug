import React from "react";
import {
  Box,
  TableRow,
  TableCell,
  Typography,
  Grid,
  Avatar,
} from "@mui/material";

import DataTable from "components/DataTable";
import CustomerDetails from "components/CustomerDetails";
import { client } from "utils/api";
import { User } from "utils/types/user";
import { customerAvatar } from "utils/avatar";

import classes from "./Customers.module.scss";

const getCustomers = async () => {
  const response = await client.get("/protected/admin/shop/customers");
  return response.data?.payload;
};

const Customers = () => {
  const headers: any = ["Nom", "Dernière commande"];
  const [customers, setCustomers] = React.useState<User[]>([]);
  const [selectedCustomer, setSelectedCustomer] = React.useState<User>(null);

  React.useEffect(() => {
    getCustomers().then((data) => {
      setCustomers(data);
    });
  }, []);

  return (
    <Box sx={{ borderTop: "1px solid #f0f1f8", height: "100%" }}>
      <Grid container sx={{ height: "100%" }} spacing={0}>
        <Grid item xs={8}>
          <DataTable headers={headers}>
            {customers.map((customer) => (
              <TableRow
                key={customer.uid}
                hover
                className={classes.tableRow}
                onClick={() => setSelectedCustomer(customer)}
              >
                <TableCell className={classes.tableCell}>
                  <div className={classes.user}>
                    <Avatar
                      className={classes.profileImage}
                      {...customerAvatar(customer)}
                    />
                    {/* <img src={photo} alt={firstName} className={classes.profileImage} /> */}
                    <Typography
                      variant="body1"
                      color="initial"
                      className={classes.text}
                    >
                      {customer.firstName} {customer.lastName}
                    </Typography>
                  </div>
                </TableCell>
                <TableCell>02/11/2022</TableCell>
              </TableRow>
            ))}
          </DataTable>
        </Grid>
        <Grid item xs={4}>
          {selectedCustomer && <CustomerDetails customer={selectedCustomer} />}
        </Grid>
      </Grid>
    </Box>
  );
};

Customers.title = "Clients";

export default Customers;
