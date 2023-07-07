import React from "react";
import { useDispatch, connect } from "react-redux";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";

import { closeAlert, getAlert } from "store/reducers/appReducer";
import { RootState } from "store";

type AlertProps = {
  title: string;
  message: string;
  show: boolean;
  type: "error" | "info" | "success" | "warning";
};

function DescriptionAlerts({ alert }: { alert: AlertProps }) {
  const dispatch = useDispatch();
  return (
    <Collapse
      in={alert.show}
      sx={{ position: "fixed", right: 0, bottom: 0, m: 2 }}
    >
      <Alert
        severity={alert.type}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              dispatch(closeAlert);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        <AlertTitle>{alert.title}</AlertTitle>
        {alert.message}
      </Alert>
    </Collapse>
  );
}

export default connect((state: RootState) => ({
  alert: getAlert(state),
}))(DescriptionAlerts);
