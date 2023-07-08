import React, {
  useEffect,
  ReactElement,
  useCallback,
  useState,
  memo,
} from "react";
import { useRouter } from "next/router";
import { Box, CssBaseline, Drawer, Toolbar } from "@mui/material";
import { useSelector } from "react-redux";

import { useDispatch, RootState } from "store";
import Sidebar from "components/SideBar";
import Header from "components/Header";
import Alert from "components/Alert";
import { auth } from "firebase-config.js";
import { fetchProfile } from "store/api/profile";
import { fetchAdminShop, shopLoaded, getShop } from "store/reducers/shopSlice";
import Loading from "components/Loading";
import { initSocketIo } from "utils/socketIo";
import { useAuth } from "contexts/AuthUserContext";

import classes from "./AppLayout.module.scss";

const MemoizedHeader = memo(Header);
const MemoizedSidebar = memo(Sidebar);
const MemoizedLoading = memo(Loading);
const MemoizedAlert = memo(Alert);

const DRAWER_WIDTH = 300;

const drawerStyle = {
  desktop: {
    display: { xs: "none", sm: "block" },
    "& .MuiDrawer-paper": {
      boxSizing: "border-box",
      width: DRAWER_WIDTH,
      border: "none",
    },
  },
  mobile: {
    display: { xs: "block", sm: "none" },
    "& .MuiDrawer-paper": {
      boxSizing: "border-box",
      width: DRAWER_WIDTH,
    },
  },
};

type LayoutProps = {
  title?: string;
  children: ReactElement;
};

const Layout = ({ children, title }: LayoutProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const isShopLoaded = useSelector((state: RootState) => shopLoaded(state));
  const shop = useSelector((state: RootState) => getShop(state));

  const [mobileOpen, setMobileOpen] = useState(false);
  const { authUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && !authUser) router.push("/login");

    auth.currentUser?.getIdToken().then(() => {
      dispatch(fetchProfile());
      dispatch(fetchAdminShop());
      initSocketIo().then((socket) => (window.socketIo = socket));
    });
  }, [authUser, loading]);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prevState) => !prevState);
  }, []);

  if (!authUser) {
    return (
      <Box component="main" className={classes.mainContainer}>
        <MemoizedLoading />
      </Box>
    );
  }

  if (isShopLoaded && !shop) {
    return (
      <Box component="main" className={classes.mainContainer}>
        {"Vous n'avez aucune boutique."}
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MemoizedHeader
        title={title}
        drawerWidth={DRAWER_WIDTH}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={drawerStyle.mobile}
        >
          <MemoizedSidebar />
        </Drawer>
        <Drawer variant="permanent" sx={drawerStyle.desktop} open>
          <MemoizedSidebar />
        </Drawer>
      </Box>
      <Box component="main" className={classes.mainContainer}>
        <Toolbar />
        {!isShopLoaded && <MemoizedLoading />}
        {isShopLoaded && shop && children}
        <MemoizedAlert />
      </Box>
    </Box>
  );
};

export default Layout;
