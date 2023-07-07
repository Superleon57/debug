import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { green, yellow } from "@mui/material/colors";
import CircleIcon from "@mui/icons-material/Circle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { LoadingButton } from "@mui/lab";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useRouter } from "next/router";

import { Shop } from "utils/types/Shop";
import { shopLogoAvatar } from "utils/avatar";
import { useDispatch, useSelector } from "store";
import {
  fetchShopList,
  getShops,
  getUpdateShopStatus,
  updateShopStatus,
} from "store/reducers/supervisorReducer";
import { ProtectedRoute } from "components/ProtectedRoute";
import { Role } from "utils/types/Role";

type ShopTableProps = {
  shops: Shop[];
};

const StatusIcon = ({ isDisabled }: { isDisabled: boolean }) => {
  return (
    <Box display="flex">
      {isDisabled ? (
        <CircleIcon sx={{ color: yellow[700], mr: 1 }} fontSize="small" />
      ) : (
        <CheckCircleIcon sx={{ color: green[500], mr: 1 }} fontSize="small" />
      )}

      {isDisabled ? "Désactivé" : "Activé"}
    </Box>
  );
};

const ShopTable = ({ shops }: ShopTableProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const isLoading = useSelector(getUpdateShopStatus) === "loading";

  const onActivate = (shopId: string) => {
    dispatch(updateShopStatus({ shopId, disabled: false }));
  };

  const onDeactivate = (shopId: string) => {
    dispatch(updateShopStatus({ shopId, disabled: true }));
  };

  return (
    <ProtectedRoute allowedRoles={[Role.SUPERVISOR]}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Boutique</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Pays</TableCell>
              <TableCell>Date de création</TableCell>
              <TableCell>Date de modification</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shops?.map((shop) => {
              const isShopDisabled = shop?.disabled;
              return (
                <TableRow key={shop?.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar {...shopLogoAvatar(shop, 40)} src={shop?.logo} />
                      <Typography
                        variant="body1"
                        color="initial"
                        sx={{ ml: 2 }}
                      >
                        {shop?.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{shop?.address?.address}</TableCell>
                  <TableCell>
                    <StatusIcon isDisabled={isShopDisabled} />
                  </TableCell>
                  <TableCell>{shop?.address?.countryName}</TableCell>
                  <TableCell>
                    {new Date(shop?.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(shop?.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        router.push("/supervisor/fees/" + shop?.id)
                      }
                    >
                      <AttachMoneyIcon color="secondary" />
                    </IconButton>
                    {isShopDisabled ? (
                      <LoadingButton
                        variant="contained"
                        onClick={() => onActivate(shop?.id)}
                        loading={isLoading}
                        color="success"
                      >
                        Activer
                      </LoadingButton>
                    ) : (
                      <LoadingButton
                        variant="outlined"
                        onClick={() => onDeactivate(shop?.id)}
                        loading={isLoading}
                        color="secondary"
                      >
                        Désactiver
                      </LoadingButton>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </ProtectedRoute>
  );
};

/* 
  Todo:
  - Add restriction to access this page
  - Add a search bar
  - Add a filter
  - Add a pagination
  
*/
const Supervisor = () => {
  const dispatch = useDispatch();
  const shops = useSelector(getShops);

  useEffect(() => {
    dispatch(fetchShopList());
  }, [dispatch]);

  return (
    <>
      <ShopTable shops={shops} />
    </>
  );
};

Supervisor.title = "Supervision";

export default Supervisor;
