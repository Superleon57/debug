import React from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Head from "next/head";

import classes from "./Header.module.css";

type HeaderProps = {
  drawerWidth: number;
  handleDrawerToggle: () => void;
  title?: string;
};

const Header = ({ drawerWidth, handleDrawerToggle, title }: HeaderProps) => {
  const pageTitle = `Onlivyou - ${title ?? "Tableau de bord"}`;
  return (
    <AppBar
      className={classes.appBar}
      position="absolute"
      style={{ zIndex: 1, backgroundColor: "white", paddingTop: "20px" }}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon className={classes.icon} />
        </IconButton>
        <Typography noWrap component="div" className={classes.text}>
          {title ?? "Tableau de bord"}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
