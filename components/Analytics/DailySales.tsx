import { Modal, Box, Typography, Button } from "@mui/material";
import dynamic from "next/dynamic";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

import { client } from "utils/api";

const Chart = dynamic(() => import("react-charts").then((mod) => mod.Chart), {
  ssr: false,
});

function DailySalesChart({ data }: { data: any[] }) {
  console.log("data", data);
  const defaultData = [
    {
      label: "Nombre d'articles vendus",
      data,
    },
  ];
  const primaryAxis = useMemo(
    () => ({
      getValue: (value: { title: string }) => value.title as string,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    () => [
      {
        getValue: (value: { sales: number }) => value.sales as number,
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

const fetchTopTenSales = async () => {
  const result = await client.get("/protected/admin/statistics/top-ten-sales");

  return result.data.payload;
};

const DailySales = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Array<any>>([]);

  useImperativeHandle(ref, () => ({
    openModal() {
      fetchTopTenSales().then((result: Array<any>) => {
        setData(result);
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
          Articles les plus vendus aujourd&apos;hui
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <DailySalesChart data={data} />
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

DailySales.displayName = "DailySales";

export default DailySales;
