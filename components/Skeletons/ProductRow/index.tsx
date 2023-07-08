import * as React from "react";
import { Typography, Skeleton, TableRow, TableCell } from "@mui/material";

const ProductRowSkeleton = ({ rowCount = 1 }: { rowCount?: number }) => {
  if (rowCount < 1) {
    rowCount = 1;
  }
  return (
    <>
      {[...Array(rowCount)].map((_, index) => {
        return (
          <TableRow key={index}>
            <TableCell>
              <Skeleton variant="rectangular" width="20%" height={75} />
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
    </>
  );
};

export default ProductRowSkeleton;
