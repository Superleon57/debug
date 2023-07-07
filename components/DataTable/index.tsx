import React from "react";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import classes from "./DataTable.module.scss";

interface DataTableProps {
  headers: string[];
  children?: JSX.Element | JSX.Element[] | string | string[];
}

const DataTable = ({ headers, children }: DataTableProps) => {
  const TableHeaders = () =>
    headers.map((title: string, index: number) => (
      <TableCell key={index}>{title}</TableCell>
    ));

  return (
    <TableContainer
      component={Paper}
      className={classes.tableContainer}
      sx={{
        boxShadow: 0,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>{TableHeaders()}</TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
