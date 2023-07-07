import React, {
  useState,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react";
import dynamic from "next/dynamic";
import { Box, Button, Modal, Typography } from "@mui/material";

import { client } from "utils/api";
const Chart = dynamic(() => import("react-charts").then((mod) => mod.Chart), {
  ssr: false,
});

const boxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function MonthlySalesChart({ data }: { data: any[] }) {
  const defaultData = [
    {
      label: "Nombre d'articles vendus",
      data: data,
    },
  ];

  console.log("data", defaultData);

  const primaryAxis = useMemo(
    () => ({
      getValue: (value: { date: Date }) => value.date as Date,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    () => [
      {
        getValue: (value: { total: number }) => value.total as number,
      },
    ],
    []
  );

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      {data?.length ? (
        <Chart
          options={{
            data: defaultData,
            primaryAxis,
            secondaryAxes,
          }}
        />
      ) : (
        ""
      )}
    </Box>
  );
}

const fetchMonthlyChart = async () => {
  const body = {
    payload: {},
  };

  const result = await client.post("/protected/admin/statistics/", body);
  const { salesByDate } = result.data.payload.sales;

  return salesByDate;
};

const MonthlySales = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Array<any>>([]);

  useImperativeHandle(ref, () => ({
    openModal() {
      fetchMonthlyChart().then((salesByDate: Array<any>) => {
        salesByDate.map((item) => {
          item.date = new Date(item.date);

          return item;
        });

        setData(salesByDate);
      });
      setOpen(true);
    },
  }));

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={boxStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Ventes du mois
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <MonthlySalesChart data={data} />
        </Typography>
        <Button
          onClick={() => {
            handleClose();
          }}
          variant="contained"
          color="success"
          sx={{ mt: 2, mr: 1 }}
        >
          Valider
        </Button>
      </Box>
    </Modal>
  );
});

MonthlySales.displayName = "MonthlySales";

export default MonthlySales;
