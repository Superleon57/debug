import React, {
  useState,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react";
import dynamic from "next/dynamic";
import { Box, Button, Modal, Typography } from "@mui/material";
import moment from "moment";

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

function NewCustomersChart({ data }: { data: any[] }) {
  data = [
    {
      date: new Date("2023-01-01"),
      total: 10,
    },
    {
      date: new Date("2023-01-02"),

      total: 20,
    },

    {
      date: new Date("2023-01-03"),

      total: 15,
    },
  ];
  const defaultData = [
    {
      label: "Nouveaux clients",
      data: data,
    },
  ];

  console.log("data", defaultData);

  const primaryAxis = useMemo(
    () => ({
      getValue: (value: { date: Date }) =>
        moment(value.date).format("DD. MMM") as string,
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

const NewCustomers = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [data] = useState<Array<any>>([]);

  useImperativeHandle(ref, () => ({
    openModal() {
      // fetchMonthlyChart().then((salesByDate: Array<any>) => {
      //   salesByDate.map(item => {
      //     item.total = item.total;
      //     item.date = new Date(item.date);

      //     return item;
      //   });

      //   setData(salesByDate);
      // });
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
          Nouveaux clients
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <NewCustomersChart data={data} />
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

NewCustomers.displayName = "NewCustomers";

export default NewCustomers;
