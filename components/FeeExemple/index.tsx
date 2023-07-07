import React, { useState } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Modal,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { Fees } from "utils/types/Fees";

import classes from "./FeeExemple.module.scss";

const CloseButton = ({ handleClose }: { handleClose: () => void }) => {
  return (
    <IconButton
      color="secondary"
      onClick={handleClose}
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        m: 2,
      }}
    >
      <CloseIcon />
    </IconButton>
  );
};

const exempleDistances = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const TotalButtons = ({ setTotal, fees }: { setTotal: any; fees: Fees }) => {
  const exempleTotals = fees.customerFees.map((customerFee) => {
    return customerFee.minimumCartPrice;
  });

  return (
    <div>
      {exempleTotals.map((total) => (
        <Button
          key={total}
          variant="contained"
          color="secondary"
          sx={{ mr: 1, mb: 1 }}
          onClick={() => setTotal(total)}
        >
          {total / 100} €
        </Button>
      ))}
    </div>
  );
};

export const FeeExemple = ({ fees }: { fees: Fees }) => {
  const [total, setTotal] = useState(2000);
  const [open, setOpen] = useState(false);
  const totalHT = Math.round(total / (1 + 20 / 100));

  const handleClose = () => {
    setOpen(false);
  };

  const findNearestCustomerFee = () => {
    const { customerFees } = fees;

    const nearest = customerFees.find(
      (customerFee) =>
        total >= customerFee.minimumCartPrice &&
        total <= customerFee.maximumCartPrice
    );

    return nearest;
  };

  const getDeliveryLevel = (distanceInKm: number): any => {
    const customerFee = findNearestCustomerFee();

    return customerFee?.levels.find(
      (level) => distanceInKm >= level.from && distanceInKm <= level.to
    );
  };

  const getDeliveryManReward = (distance: number) => {
    const deliveryFee = fees.baseDeliveryFee + distance * fees.deliveryFeePerKm;
    return deliveryFee;
  };

  const getCustomerFee = (distance: number) => {
    const deliveryManReward = getDeliveryManReward(distance);

    const customerMaxFee = getDeliveryLevel(distance);

    if (!customerMaxFee) {
      return 0;
    }

    return Math.min(customerMaxFee.delivery, deliveryManReward);
  };

  const getServiceFee = (distance: number) => {
    const deliveryLevel = getDeliveryLevel(distance);

    if (!deliveryLevel) {
      return 0;
    }

    return deliveryLevel.service;
  };

  const onlivyouLeftToPay = (distance: number) => {
    const deliveryManReward = getDeliveryManReward(distance);
    const customerFee = getCustomerFee(distance);

    const leftToPay = deliveryManReward - customerFee;

    if (leftToPay < 0) {
      return 0;
    }

    return leftToPay;
  };

  const getPlatformFee = () => {
    return Math.round(totalHT * (fees.platformFee / 100));
  };

  const onlivyouReward = (distance: number) => {
    const serviceFee = getServiceFee(distance);
    const reward = Math.round(totalHT * (fees.platformFee / 100) + serviceFee);

    return reward - onlivyouLeftToPay(distance);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        color="secondary"
        sx={{ mt: 2 }}
      >
        Exemple de calcul
      </Button>
      {fees.customerFees && (
        <Modal open={open} onClose={handleClose}>
          <Box className={classes.modal}>
            <CloseButton handleClose={handleClose} />
            <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
              <h2>Exemple de calcul</h2>
              <p> Panier TTC : {total / 100} €</p>
              <p> Panier HT : {totalHT / 100} €</p>

              <TotalButtons setTotal={setTotal} fees={fees} />

              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Distance</TableCell>
                    <TableCell>Gain livreur</TableCell>
                    <TableCell>Frais de livraison</TableCell>
                    <TableCell>Frais de service</TableCell>
                    <TableCell>Compensation Onliv you</TableCell>
                    <TableCell>
                      Frais commerçant ({fees.platformFee}%)
                    </TableCell>
                    <TableCell>Gain Onliv you</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exempleDistances.map((distance) => {
                    const canDeliver = () => {
                      if (getDeliveryLevel(distance) === undefined) {
                        return false;
                      }

                      return true;
                    };
                    return (
                      <TableRow key={distance}>
                        <TableCell>{distance} KM</TableCell>
                        {canDeliver() ? (
                          <>
                            <TableCell>
                              {getDeliveryManReward(distance) / 100} €
                            </TableCell>
                            <TableCell>
                              {getCustomerFee(distance) / 100} €
                            </TableCell>
                            <TableCell>
                              {getServiceFee(distance) / 100} €
                            </TableCell>
                            <TableCell>
                              {onlivyouLeftToPay(distance) / 100} €
                            </TableCell>
                            <TableCell>{getPlatformFee() / 100} €</TableCell>
                            <TableCell>
                              {onlivyouReward(distance) / 100} €
                            </TableCell>
                          </>
                        ) : (
                          <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                            Livraison Impossible
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Modal>
      )}
    </>
  );
};
