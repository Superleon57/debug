import * as React from "react";
import { Typography, Skeleton, TableRow, TableCell, Box } from "@mui/material";

const UserAvatarAndName = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "8px",
      }}
    >
      <Skeleton variant="circular" height={40} width={40} />
      <Typography variant="body1" width={1}>
        <Skeleton />
      </Typography>
    </Box>
  );
};

const OrderRowSkeleton = ({ rowCount = 1 }: { rowCount?: number }) => {
  if (rowCount < 1) {
    rowCount = 1;
  }
  return (
    <>
      {[...Array(rowCount)].map((_, index) => {
        return (
          <TableRow key={index}>
            <TableCell>
              <Typography variant="body1">
                <Skeleton />
              </Typography>
            </TableCell>

            <TableCell>
              <UserAvatarAndName />
            </TableCell>

            <TableCell>
              <UserAvatarAndName />
            </TableCell>

            <TableCell>
              <Typography variant="body1">
                <Skeleton />
              </Typography>
            </TableCell>

            <TableCell>
              <Skeleton variant="rounded" height={32} width={150} />
            </TableCell>

            <TableCell>
              <Typography variant="body1">
                <Skeleton />
              </Typography>
            </TableCell>

            <TableCell>
              <Skeleton variant="rounded" height={24} width={24} />
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

export default OrderRowSkeleton;
