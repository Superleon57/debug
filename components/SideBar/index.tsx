import React from "react";
import Link from "next/link";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  List,
  ListItem,
  ListItemButton,
  styled,
  Toolbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import { connect } from "react-redux";

import IconButton from "components/IconButton";
import { RootState, useDispatch, useSelector } from "store";
import { getShop, resetShop } from "store/reducers/shopSlice";
import { Shop } from "utils/types/Shop";
import { Role } from "utils/types/Role";
import { getProfile, resetProfile } from "store/api/profile";
import { resetOrder } from "store/reducers/orderReducer";
import { resetSingleProduct } from "store/reducers/singleProductSlice";
import { resetSupervisor } from "store/reducers/supervisorReducer";
import { useAuth } from "contexts/AuthUserContext";

import classes from "./SideBar.module.scss";

const ShopLogo = styled("img")({
  height: "50px",
  width: "50px",
  borderRadius: "50%",
  objectFit: "cover",
});

const AccordionLinks = ({ link }: { link: any }) => (
  <Accordion elevation={0}>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      className={classes.accordionSummary}
    >
      <a className={classes.link}>
        <IconButton icon={link.icon} text={link.name} />
      </a>
    </AccordionSummary>
    <AccordionDetails>
      <List>
        {link.subLinks.map((subLink: any, index: number) => (
          <ListItem disablePadding className={classes.ListItemLink} key={index}>
            <Link href={subLink.path} className={classes.link}>
              <ListItemButton>{subLink.name}</ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </AccordionDetails>
  </Accordion>
);

function Sidebar({ shop }: { shop: Shop }) {
  const dispatch = useDispatch();
  const user = useSelector(getProfile);
  const { signOut } = useAuth();

  const handleSignOut = () => {
    dispatch(resetOrder());
    dispatch(resetShop());
    dispatch(resetSingleProduct());
    dispatch(resetSupervisor());
    dispatch(resetProfile());
    signOut();
  };

  const navbarLinks = [
    {
      name: "Tableau de bord",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      name: "Boutique",
      icon: <StorefrontIcon />,
      isAccordion: true,
      subLinks: [
        {
          name: "Produits",
          path: "/products",
        },
        {
          name: "Catégories",
          path: "/categories",
        },
      ],
    },
    {
      name: "Stats caisse",
      icon: <PointOfSaleIcon />,
      path: "/payments",
    },
    {
      name: "Commandes",
      icon: <LocalMallIcon />,
      path: "/orders",
    },
    {
      name: "Paramètres",
      icon: <SettingsIcon />,
      path: "/settings",
    },
    {
      name: "Superviseur",
      icon: <SettingsIcon />,
      isAccordion: true,
      subLinks: [
        {
          name: "Boutiques",
          path: "/supervisor",
        },
        {
          name: "Gestion des frais",
          path: "/supervisor/fees",
        },
      ],
      roles: [Role.SUPERVISOR],
    },
  ];

  return (
    <Box className={classes.sideBar}>
      <Toolbar sx={{ m: "2rem" }}>
        <img src="/images/LIVyou_Q.png" alt="" width={150} />
      </Toolbar>

      <List className={classes.LinkList}>
        {navbarLinks.map((link, index) => {
          if (link.roles && !link.roles.includes(user.role)) return null;

          if (link.isAccordion) {
            return <AccordionLinks link={link} key={index} />;
          }

          return (
            <ListItem
              key={index}
              disablePadding
              className={classes.ListItemLink}
            >
              <Link href={link.path} className={classes.link}>
                <ListItemButton>
                  <IconButton icon={link.icon} text={link.name} />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}

        {shop?.logo && (
          <ListItem className={classes.ListItemLink}>
            <Link href="/settings" className={classes.link}>
              <ListItemButton>
                <IconButton
                  icon={<ShopLogo src={shop.logo} />}
                  text={shop.name}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        )}
        <ListItem className={classes.ListItemLink}>
          <ListItemButton onClick={handleSignOut}>
            <a className={classes.link}>
              <IconButton icon={<LogoutIcon />} text="Déconnexion" />
            </a>
          </ListItemButton>
        </ListItem>
      </List>

      <img src="/images/visuel-front.jpg" alt="" className={classes.image} />
    </Box>
  );
}

export default connect((state: RootState) => ({
  shop: getShop(state),
}))(Sidebar);
