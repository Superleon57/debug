import React, { ReactElement } from "react";
import { ListItemIcon, createTheme, ThemeProvider } from "@mui/material";

type IconButton = {
  icon: ReactElement;
  text: string;
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#04a2ae",
    },
  },
});

const IconButton = ({ icon, text }: IconButton) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <ThemeProvider theme={theme}>
        <ListItemIcon>
          {React.cloneElement(icon, { color: "primary" })}
        </ListItemIcon>
      </ThemeProvider>
      {text}
    </div>
  );
};

export default IconButton;
