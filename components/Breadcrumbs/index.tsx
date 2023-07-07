import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { styled } from "@mui/system";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  "& ol": {
    justifyContent: "flex-start",
    flexWrap: "wrap",
    padding: 0,
    margin: 0,
  },
  "& li": {
    display: "flex",
    alignItems: "center",
    textTransform: "capitalize",
    fontWeight: 500,
    fontSize: "1rem",
    color: theme.palette.text.secondary,

    "& a": {
      textDecoration: "none",
    },

    "& svg": {
      fontSize: "1.5rem",
    },
    "&:last-child": {
      "& svg": {
        display: "none",
      },
    },
  },
}));

const BreacdcrumbsComponent = ({ paths }: { paths: any }) => {
  return (
    <StyledBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {paths.map((path: any, index: number) => {
        if (index === paths.length - 1) {
          return (
            <Typography key={index} color="text.primary" fontWeight={600}>
              {path.name}
            </Typography>
          );
        } else {
          return (
            <Link key={index} color="inherit" href={path.href}>
              {path.name}
            </Link>
          );
        }
      })}
    </StyledBreadcrumbs>
  );
};

export default BreacdcrumbsComponent;
