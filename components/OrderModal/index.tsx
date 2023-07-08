import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  IconButton,
  TableContainer,
  Table,
  TableRow,
  TableCell as MuiTableCell,
  TableBody,
  Modal,
  Typography,
  Box,
  Divider,
  Stack,
  styled,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Grid,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  Close as CloseIcon,
  Dialpad as DialpadIcon,
  LocalShipping as LocalShippingIcon,
  Call as CallIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  EditNote as EditNoteIcon,
  Undo as UndoIcon,
} from "@mui/icons-material";
import moment from "moment";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useSelector, useDispatch, RootState } from "store";
import { OrderModalTableSkeleton, OrderStatusChip } from "components";
import BreacdcrumbsComponent from "components/Breadcrumbs";
import { Order } from "utils/types/Order";
import { OrderItem } from "utils/types/OrderItem";
import { OrderStatus } from "utils/enums/OrderStatus";
import { client } from "utils/api";
import { formatDate } from "utils/firebase";
import { fetchOrderItems } from "store/reducers/orderReducer/actions";
import {
  getEditionMode,
  getOrderItems,
  handleEditionMode,
  resetOrder,
  setEditionMode,
} from "store/reducers/orderReducer";
import AlertDialog from "components/AlertDialog";
import { CancelReasons } from "utils/enums/CancelReasons";
import orderValidationSchema, {
  OrderValidation,
} from "utils/validation/orderValidationSchema";
import { formatCurrency } from "utils/currency";
import {
  fetchCancelOrder,
  fetchHoldOrder,
  fetchNextStep,
  getOrderById,
} from "store/api/orders";

import classes from "./OrderModal.module.scss";

const TableCell = styled(MuiTableCell)({
  borderBottom: "none",
});

const OrderDate = ({ order }: { order: Order }) => {
  const formatedDate = formatDate(order.creationDate);
  const dateFromNow = moment(formatedDate).fromNow();

  return (
    <Typography variant="subtitle2" color="text.secondary" sx={{ width: 1 }}>
      {dateFromNow}
    </Typography>
  );
};

const TopSection = ({
  order,
  handleClose,
}: {
  order: Order;
  handleClose: () => void;
}) => {
  const dispatch = useDispatch();

  const canEdit = order.status === OrderStatus.PAID;

  const editionMode = useSelector(getEditionMode);

  const handleEdit = useCallback(() => {
    dispatch(handleEditionMode());
  }, [order]);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      spacing={4}
      alignItems="start"
    >
      <Stack spacing={0} alignItems="start">
        <BreacdcrumbsComponent
          paths={[
            { href: "/orders", name: "Commandes" },
            { name: order?.orderNumber },
          ]}
        />
        <OrderDate order={order} />
      </Stack>

      <Stack spacing={0} alignItems="end" direction="row">
        <IconButton color="secondary" onClick={handleEdit} disabled={!canEdit}>
          {editionMode ? <UndoIcon /> : <EditNoteIcon />}
        </IconButton>
        <IconButton color="secondary" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
};

const TakingCode = ({ order }: { order: Order }) => {
  const [takingCode, setTakingCode] = useState<string>("");

  const fetchTakingCode = async (orderId: string) => {
    const result = await client.get("/protected/admin/order/code/" + orderId);

    const { payload } = result.data;

    if (!payload.code) return;

    const { code } = payload;

    setTakingCode(code?.code);
  };

  useEffect(() => {
    if (order.status !== OrderStatus.ASSIGNED_TO_DELIVERY_MAN) return;
    fetchTakingCode(order.id);
  }, [order.status]);

  return (
    <>
      {takingCode && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
        >
          <DialpadIcon color="secondary" />

          <Typography variant="h6" fontWeight="bold" fontFamily="Montserrat">
            {takingCode}
          </Typography>
        </Stack>
      )}
    </>
  );
};

const ProductQuantity = ({ item }: { item: OrderItem }) => {
  const { watch, control } = useFormContext();

  const editionMode = useSelector(getEditionMode);

  const { update } = useFieldArray({
    control,
    name: "itemsToCancel",
  });
  const itemsToCancel = watch("itemsToCancel");
  const selectedItem = itemsToCancel.find((i: any) => i.id === item.id);

  const orderedQuantity = item.quantity;

  const disableMinus =
    selectedItem && orderedQuantity === selectedItem.quantity;
  const disablePlus = selectedItem && selectedItem.quantity === 0;

  const remainingQuantity = orderedQuantity - selectedItem?.quantity;

  const addQuantity = () => {
    if (!selectedItem) return;
    const index = itemsToCancel.indexOf(selectedItem);

    update(index, { id: item.id, quantity: selectedItem.quantity - 1 });
  };

  const removeQuantity = () => {
    if (!selectedItem) return;
    const index = itemsToCancel.indexOf(selectedItem);

    update(index, { id: item.id, quantity: selectedItem.quantity + 1 });
  };

  if (selectedItem && editionMode) {
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton
          color="error"
          disabled={disableMinus}
          onClick={removeQuantity}
        >
          <RemoveIcon sx={{ fontSize: "1rem" }} />
        </IconButton>

        <Typography variant="subtitle1">
          x {remainingQuantity}/{orderedQuantity}
        </Typography>

        <IconButton color="info" disabled={disablePlus} onClick={addQuantity}>
          <AddIcon sx={{ fontSize: "1rem" }} />
        </IconButton>
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="subtitle1">
        x {orderedQuantity - (item.canceledQuantity || 0)}/{orderedQuantity}
      </Typography>
    </Stack>
  );
};

const ProductRow = ({ item }: { item: OrderItem }) => {
  const { watch, control } = useFormContext();

  const editionMode = useSelector(getEditionMode);

  const { append, remove } = useFieldArray({
    control,
    name: "itemsToCancel",
  });

  const itemsToCancel = watch("itemsToCancel");

  const getUnitPrice = (item: OrderItem) => item.detail.price / 100;

  const itemSelected = () =>
    itemsToCancel.some(
      (selectedItem: OrderItem) => selectedItem.id === item.id
    );

  const handleProductSelection = useCallback(
    (item: OrderItem) => {
      const index = itemsToCancel.findIndex(
        (field: any) => field.id === item.id
      );

      if (index === -1) {
        const newItem = { id: item.id, quantity: 0 };
        append(newItem);
      } else {
        remove(index);
      }
    },
    [append, itemsToCancel, remove]
  );

  const variant = item?.detail?.Variants?.find(
    (variant) => variant.id == item.variantId
  );

  return (
    <TableRow>
      {editionMode && (
        <TableCell padding="none">
          <Checkbox
            color="primary"
            checked={itemSelected()}
            onClick={() => handleProductSelection(item)}
            sx={{ p: 0 }}
          />
        </TableCell>
      )}
      <TableCell>
        <img
          src={item.detail.imagesURL[0]}
          alt=""
          className={classes.productImage}
        />
      </TableCell>
      <TableCell>
        <Typography variant="subtitle1" fontWeight="bold">
          {item.detail.title}
        </Typography>
        {variant && (
          <Typography variant="caption" color="text.secondary">
            {variant.color.name} - {variant.size.name}
          </Typography>
        )}
      </TableCell>
      <TableCell align="left" size="small" padding="none">
        <ProductQuantity item={item} />
      </TableCell>
      <TableCell>
        <Stack direction="column" spacing={0} alignItems="end">
          <Typography variant="body1" color="text.secondary" fontWeight="bold">
            {(item.quantity - (item.canceledQuantity || 0)) *
              getUnitPrice(item)}
            €
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {getUnitPrice(item)} € / u
          </Typography>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

const ProductList = () => {
  const orderItems = useSelector(getOrderItems);

  const ordersItemStatus = useSelector(
    (state: RootState) => state.order.orderItemsStatus
  );

  const isLoading = ordersItemStatus === "loading";

  if (isLoading) {
    return <OrderModalTableSkeleton rowCount={3} />;
  }

  return (
    <TableContainer>
      <Table>
        <TableBody>
          {!orderItems && "Aucune commande n'a été sélectionnée"}
          {orderItems.map((item: any, index: number) => (
            <ProductRow key={index} item={item} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const PhoneNumber = ({ order }: { order: Order }) => {
  const canShowPhoneNumber = () => {
    if (order?.status !== OrderStatus.PAID) return false;
    if (!order?.user.phone) return false;

    return true;
  };

  function addSpaceEveryTwoChars(str: string) {
    return str.split("").reduce((acc, char, index) => {
      if (index % 2 === 0 && index !== 0) {
        return acc + " " + char;
      }
      return acc + char;
    }, "");
  }

  return (
    <Stack direction="row" spacing={1} width={1} justifyContent="end">
      {canShowPhoneNumber() && (
        <>
          <CallIcon color="secondary" />
          <Typography variant="body1" color="text.secondary">
            {addSpaceEveryTwoChars(order?.user.phone)}
          </Typography>
        </>
      )}
    </Stack>
  );
};

const CustomerDetails = ({ order }: { order: Order }) => {
  return (
    <Stack
      spacing={0}
      direction="row"
      useFlexGap
      flexWrap="wrap"
      justifyItems="center"
    >
      <Stack
        spacing={0}
        direction="row"
        justifyContent="space-between"
        width={1}
      >
        <Stack>
          <Typography variant="body1" color="text.secondary" fontWeight="bold">
            {order?.user.firstName} {order?.user.lastName}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {order?.deliveryAddress.cp} {order?.deliveryAddress.ville}
          </Typography>
        </Stack>
        <OrderStatusChip status={order?.status} />
      </Stack>
      <PhoneNumber order={order} />
    </Stack>
  );
};

const useCountItems = (order: Order) => {
  const { watch } = useFormContext();
  const itemsToCancel = watch("itemsToCancel");
  const orderItems = useSelector(getOrderItems);

  const editionMode = useSelector(getEditionMode);

  const numberOfItems = useMemo(
    () => orderItems.reduce((total, item) => total + item.quantity, 0),
    [orderItems]
  );

  const numberOfItemsToCancel = useMemo(
    () =>
      itemsToCancel.reduce(
        (total: number, item: any) => total + item.quantity,
        0
      ),
    [itemsToCancel]
  );

  const numberOfCanceledItems = useMemo(
    () =>
      orderItems.reduce((total, item) => {
        if (!item.canceledQuantity) return total;
        return total + item.canceledQuantity;
      }, 0),
    [orderItems]
  );

  const remainingItems = useMemo(() => {
    if (!editionMode) return numberOfItems - numberOfCanceledItems;

    return numberOfItems - numberOfItemsToCancel;
  }, [
    numberOfItems,
    numberOfItemsToCancel,
    numberOfCanceledItems,
    editionMode,
  ]);

  return { numberOfItems, numberOfItemsToCancel, remainingItems };
};

const useOrderTotal = (order: Order) => {
  const { watch } = useFormContext();
  const itemsToCancel = watch("itemsToCancel");

  const orderItems = useSelector(getOrderItems);

  const editionMode = useSelector(getEditionMode);

  const subTotal = useMemo(() => order?.fees.subTotal, [order]);

  const totalPrice = useMemo(() => order?.fees.totalPrice, [order]);

  const totalToCancel = useMemo(
    () =>
      itemsToCancel.reduce((acc, item) => {
        const orderItem = orderItems.find((i) => i.id === item.id);

        if (!orderItem) return acc;

        return acc + item.quantity * orderItem.detail.price;
      }, 0),
    [itemsToCancel]
  );

  const totalCanceled = useMemo(
    () =>
      orderItems.reduce((acc, item) => {
        if (!item.canceledQuantity) return acc;

        return acc + item.canceledQuantity * item.detail.price;
      }, 0),
    [orderItems]
  );

  const remainingSubTotal = useMemo(() => {
    if (!editionMode) return subTotal - totalCanceled;

    return subTotal - totalToCancel;
  }, [subTotal, totalToCancel, totalCanceled, editionMode]);

  const remainingTotal = useMemo(() => {
    if (!editionMode) return totalPrice - totalCanceled;

    return totalPrice - totalToCancel;
  }, [totalPrice, totalToCancel, totalCanceled, editionMode]);

  return {
    subTotal,
    totalPrice,
    totalToCancel,
    remainingTotal,
    remainingSubTotal,
  };
};

const OrderSummary = ({ order }: { order: Order }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const { remainingItems } = useCountItems(order);
  const { remainingSubTotal, remainingTotal } = useOrderTotal(order);

  const totalDeliveryCost = useMemo(
    () => formatCurrency(order?.fees.totalDeliveryCost),
    [order]
  );
  const serviceFee = useMemo(
    () => formatCurrency(order?.fees.serviceFee),
    [order]
  );

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      disableGutters
      elevation={0}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="column" width="100%" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Résumé de la commande
          </Typography>
          {!expanded && (
            <Typography sx={{ color: "text.secondary" }} variant="caption">
              {remainingItems} produits à préparer
            </Typography>
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1" color="text.secondary">
              Sous-total
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {formatCurrency(remainingSubTotal)} €
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1" color="text.secondary">
              Livraison
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {totalDeliveryCost}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1" color="text.secondary">
              Frais de service
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {serviceFee}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1" color="text.secondary">
              Total
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {formatCurrency(remainingTotal)}
            </Typography>
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

const NextStepButton = ({ order }: { order: Order }) => {
  const ordersItemStatus = useSelector((state) => state.order.orderItemsStatus);
  const orderUpdateStatus = useSelector((state) => state.order.updateStatus);

  const { remainingItems } = useCountItems(order);

  const isLoading =
    ordersItemStatus === "loading" || orderUpdateStatus === "loading";
  const canValidate =
    order?.status === OrderStatus.PAID && !isLoading && remainingItems > 0;

  return (
    <LoadingButton
      type="submit"
      variant="contained"
      color="success"
      disabled={!canValidate}
      startIcon={<LocalShippingIcon />}
      loading={isLoading}
    >
      {order?.status === OrderStatus.PAID ? "Valider" : "Traitement en cours"}
    </LoadingButton>
  );
};

const CancelOrderButton = ({ order }: { order: Order }) => {
  const dispatch = useDispatch();
  const orderUpdateStatus = useSelector((state) => state.order.updateStatus);
  const isLoading = orderUpdateStatus === "loading";

  const cancelOrder = () => {
    dispatch(fetchCancelOrder({ order, reason: CancelReasons.OUT_OF_STOCK }));
  };

  return (
    <>
      {order?.status === OrderStatus.PAID && (
        <AlertDialog
          title="Annuler la commande"
          message="Êtes vous sûr de vouloir annuler cette commande ?"
          onAccept={cancelOrder}
          acceptButtonTitle="Oui"
          cancelButtonTitle="Non"
          CustomButton={
            <LoadingButton
              variant="contained"
              color="error"
              loading={isLoading}
            >
              Annuler
            </LoadingButton>
          }
        />
      )}
    </>
  );
};

const HoldOrderButton = ({ order }: { order: Order }) => {
  const dispatch = useDispatch();
  const orderUpdateStatus = useSelector((state) => state.order.updateStatus);
  const isLoading = orderUpdateStatus === "loading";

  const holdOrder = () => {
    dispatch(fetchHoldOrder(order));
  };

  return (
    <>
      {order?.status === OrderStatus.WAITING_FOR_DELIVERY_MAN && (
        <LoadingButton
          onClick={() => {
            holdOrder();
          }}
          variant="contained"
          color="warning"
          loading={isLoading}
        >
          Mettre en attente
        </LoadingButton>
      )}
    </>
  );
};

const ActionSection = ({ order }: { order: Order }) => {
  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <NextStepButton order={order} />
        <CancelOrderButton order={order} />
        <HoldOrderButton order={order} />
      </Stack>
    </Stack>
  );
};

/* 
 TODO:
 - Fix modal on orders page : Items are not displayed
*/
const OrderModal = (props: any, ref: any) => {
  const dispatch = useDispatch();
  const [orderId, setOrderId] = useState<string>("");
  const order = useSelector((state: RootState) => getOrderById(state, orderId));

  const editionMode = useSelector(getEditionMode);

  const methods = useForm<OrderValidation>({
    resolver: yupResolver(orderValidationSchema),
    defaultValues: {
      itemsToCancel: [],
      orderId: "",
    },
  });

  const { handleSubmit, reset, setValue } = methods;

  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    openModal(orderId: string) {
      setOrderId(orderId);
      setOpen(true);
    },
  }));

  useEffect(() => {
    reset();
    if (!open) return;
    if (!orderId) {
      return;
    }

    dispatch(setEditionMode(false));
    setValue("orderId", orderId);
    dispatch(fetchOrderItems({ orderId }));
  }, [orderId, open, order?.status]);

  useEffect(() => {
    setValue("itemsToCancel", []);
  }, [editionMode]);

  const handleClose = () => {
    reset();
    dispatch(resetOrder());
    setOpen(false);
  };

  const onSubmit = (data: OrderValidation) => {
    dispatch(fetchNextStep(data));
  };

  return (
    <Modal open={open} onClose={handleClose} ref={ref}>
      <Grid
        container
        component={Box}
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Grid
          item
          {...{ xs: 12, md: 8, lg: 6, xl: 4 }}
          sx={{
            background: "#fff",
            borderRadius: { md: 3 },
            p: { xs: 1, md: 2 },
          }}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {order && (
                <>
                  <TopSection order={order} handleClose={handleClose} />

                  <Divider sx={{ my: 2 }} light />

                  <Box sx={{ overflow: "auto", p: 1 }}>
                    <CustomerDetails order={order} />

                    <TakingCode order={order} />

                    <Divider sx={{ my: 2 }} light />

                    <ProductList />

                    <OrderSummary order={order} />
                  </Box>

                  <Divider sx={{ my: 2 }} light />

                  <ActionSection order={order} />
                </>
              )}
            </form>
          </FormProvider>
        </Grid>
      </Grid>
    </Modal>
  );
};

OrderModal.displayName = "OrderModal";

export default React.forwardRef(OrderModal);
