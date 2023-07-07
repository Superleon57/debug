import React, { useEffect, useRef, useState } from "react";
import {
  styled,
  Grid,
  TableRow,
  TableCell,
  Avatar,
  Typography,
  TextField,
  Button,
  IconButton,
  TablePagination,
  Tabs,
  Tab,
  Box,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PreviewIcon from "@mui/icons-material/Preview";
import { connect } from "react-redux";
import moment from "moment";

import { RootState, useDispatch, useSelector } from "store";
import { profileLoaded } from "store/api/profile";
import { customerAvatar } from "utils/avatar";
import { client } from "utils/api";
import DataTable from "components/DataTable";
import { Order } from "utils/types/Order";
import { OrderStatusChip, OrderRowSkeleton, OrderModal } from "components";
import { formatDate } from "utils/firebase";
import { OrderStatus, OrderStatusMessages } from "utils/enums/OrderStatus";
import { formatCurrency } from "utils/currency";
import { fetchOrders } from "store/api/orders";
import { StateStatus } from "utils/types/StateStatus";

const UserAvatar = styled(Avatar)({
  outline: "2px solid #e65493",
  width: 40,
  height: 40,
  fontSize: 20,
});

const CustomTableCell = styled(TableCell)({
  border: "none",
});

const CustomTableRow = styled(TableRow)({
  ":hover": {
    backgroundColor: "#f0f7ff",
    cursor: "pointer",
  },
});

const OrdersRows = ({
  orders,
  openModal,
}: {
  orders: Order[];
  openModal: (orderId: string) => void;
}) => {
  return (
    <>
      {orders.map((order) => {
        const formatedDate = formatDate(order.creationDate);
        const dateFromNow = moment(formatedDate).fromNow();

        return (
          <CustomTableRow key={order.id} onClick={() => openModal(order.id)}>
            <CustomTableCell>{order.orderNumber}</CustomTableCell>
            <CustomTableCell>
              <Grid container spacing={0}>
                <Grid sx={{ mr: 2 }}>
                  <UserAvatar {...customerAvatar(order.user)} />
                </Grid>
                <Grid alignContent="center">
                  <Typography variant="body1" color="initial">
                    {order.user.lastName} {order.user.firstName}
                  </Typography>
                </Grid>
              </Grid>
            </CustomTableCell>
            <CustomTableCell>
              <UserAvatar src="/images/marie.jpg" />
            </CustomTableCell>
            <CustomTableCell> {dateFromNow}</CustomTableCell>
            <CustomTableCell>
              <OrderStatusChip status={order.status} />
            </CustomTableCell>
            <CustomTableCell>{formatCurrency(order.total)}</CustomTableCell>
            <CustomTableCell>
              <IconButton>
                <PreviewIcon />
              </IconButton>
            </CustomTableCell>
          </CustomTableRow>
        );
      })}
    </>
  );
};

const FiltersBar = () => {
  return (
    <Grid item xs={12}>
      <Grid container spacing={0}>
        <Grid item xs={8} sx={{ mr: 4 }}>
          <TextField
            type="text"
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
            placeholder="Rechercher avec un numéro de commande, un nom de client, un nom de livreur ou un status"
            label="Rechercher"
            fullWidth
            size="small"
            disabled
          />
        </Grid>
        <Grid item xs={"auto"} sx={{ mr: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            size="large"
            disabled
          >
            Filtres
          </Button>
        </Grid>
        <Grid item xs={"auto"}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            size="large"
            disabled
          >
            Exporter
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

interface OrdersTabProps {
  status: string;
  [key: string]: any;
}

const OrdersTab = ({ status, ...props }: OrdersTabProps) => {
  const ordersPerStatus = useSelector(
    (state: RootState) => state.orders.ordersPerStatus
  );
  const label = OrderStatusMessages[status as keyof typeof OrderStatusMessages];
  return (
    <Tab
      label={label}
      value={status}
      icon={<Chip label={ordersPerStatus[status] || "0"} size="small" />}
      iconPosition="end"
      {...props}
    />
  );
};

/* TODO: 
  - Add filters
  - save rowsPerPage in localstorage
*/
function Orders({ isProfileLoaded }: { isProfileLoaded: boolean }) {
  const dispatch = useDispatch();
  const orderModalRef = useRef(null) as any;

  const ordersStatus = useSelector((state: RootState) => state.orders.status);
  const orders = useSelector((state: RootState) => state.orders.Orders);
  const count = useSelector((state: RootState) => state.orders.count);
  const ordersPerStatus = useSelector(
    (state: RootState) => state.orders.ordersPerStatus
  );

  const isOrdersLoading = ordersStatus === StateStatus.LOADING;

  const [page, setPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState<OrderStatus>(
    OrderStatus.ALL
  );

  const [orderPerPage, setOrderPerPage] = useState(() => {
    const storedValue = localStorage.getItem("orderPerPage");
    if (!storedValue) return 10;

    const parsedValue = parseInt(storedValue, 10);
    if (isNaN(parsedValue)) return 10;

    return parsedValue;
  });

  const handlePaginationChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage + 1);
  };

  const handleChangeOrdersPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newOrderPerPage = parseInt(event.target.value, 10);
    setOrderPerPage(newOrderPerPage);
    setPage(1);
    localStorage.setItem("orderPerPage", newOrderPerPage.toString());
  };

  const TabsStatusHandler = (
    event: React.MouseEvent<HTMLButtonElement>,
    newStatusFilter: OrderStatus
  ) => {
    setStatusFilter(newStatusFilter);

    dispatch(fetchOrders({ status: newStatusFilter }));
  };

  useEffect(() => {
    if (!isProfileLoaded) return;

    dispatch(
      fetchOrders({ status: statusFilter, page, hitsPerPage: orderPerPage })
    );
  }, [page, orderPerPage, isProfileLoaded]);

  return (
    <Grid container spacing={2}>
      <OrderModal ref={orderModalRef} />

      <Box sx={{ borderBottom: 1, borderColor: "divider", m: 2 }}>
        <Tabs
          value={statusFilter}
          onChange={TabsStatusHandler}
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab
            label="Tout"
            value={OrderStatus.ALL}
            icon={
              <Chip
                label={ordersPerStatus[OrderStatus.ALL] || "0"}
                size="small"
              />
            }
            iconPosition="end"
          />
          <Tab
            label="En attente"
            value={OrderStatus.PAID}
            icon={
              <Chip
                label={ordersPerStatus[OrderStatus.PAID] || "0"}
                size="small"
              />
            }
            iconPosition="end"
          />
          <Tab
            label="Assigné à un livreur"
            value={OrderStatus.ASSIGNED_TO_DELIVERY_MAN}
            icon={
              <Chip
                label={
                  ordersPerStatus[OrderStatus.ASSIGNED_TO_DELIVERY_MAN] || "0"
                }
                size="small"
              />
            }
            iconPosition="end"
          />
          <Tab
            label="En attente d'un livreur"
            value={OrderStatus.WAITING_FOR_DELIVERY_MAN}
            icon={
              <Chip
                label={
                  ordersPerStatus[OrderStatus.WAITING_FOR_DELIVERY_MAN] || "0"
                }
                size="small"
              />
            }
            iconPosition="end"
          />
          <Tab
            label="Livraison démarée"
            value={OrderStatus.DELIVERY_STARTING}
            icon={
              <Chip
                label={ordersPerStatus[OrderStatus.DELIVERY_STARTING] || "0"}
                size="small"
              />
            }
            iconPosition="end"
          />
          <Tab
            label="Livrée"
            value={OrderStatus.DELIVERED}
            icon={
              <Chip
                label={ordersPerStatus[OrderStatus.DELIVERED] || "0"}
                size="small"
              />
            }
            iconPosition="end"
          />
          <Tab
            label="Annulée"
            value={OrderStatus.CANCELED}
            icon={
              <Chip
                label={ordersPerStatus[OrderStatus.CANCELED] || "0"}
                size="small"
              />
            }
            iconPosition="end"
          />
        </Tabs>
      </Box>

      <FiltersBar />
      <Grid item xs={12}>
        <DataTable
          headers={[
            "N° de commande",
            "Client",
            "Livreur",
            "Date",
            "Status",
            "Total",
            "Action",
          ]}
        >
          {!isOrdersLoading ? (
            <OrdersRows
              orders={orders}
              openModal={orderModalRef?.current?.openModal}
            />
          ) : (
            <OrderRowSkeleton rowCount={orderPerPage} />
          )}
        </DataTable>
        <TablePagination
          component="div"
          count={count}
          page={page - 1}
          onPageChange={handlePaginationChange}
          rowsPerPage={orderPerPage}
          onRowsPerPageChange={handleChangeOrdersPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Commandes par page"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} sur ${count}`
          }
        />
      </Grid>
    </Grid>
  );
}

Orders.title = "Commandes";

export default connect((state: RootState) => ({
  isProfileLoaded: profileLoaded(state),
}))(Orders);
