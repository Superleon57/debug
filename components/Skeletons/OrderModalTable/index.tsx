import * as React from "react";
import {
  Typography,
  Skeleton,
  TableRow,
  TableCell,
  Table,
  TableBody,
  TableContainer,
} from "@mui/material";

const OrderModalTableSkeleton = ({ rowCount = 1 }: { rowCount?: number }) => {
  if (rowCount < 1) {
    rowCount = 1;
  }
  return (
    <TableContainer>
      <Table>
        <TableBody>
          {[...Array(rowCount)].map((_, index) => {
            return (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton
                    variant="rectangular"
                    width={60}
                    height={80}
                    sx={{ borderRadius: "10px" }}
                  />
                </TableCell>

                <TableCell>
                  <Typography variant="body1">
                    <Skeleton />
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body1">
                    <Skeleton />
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderModalTableSkeleton;
