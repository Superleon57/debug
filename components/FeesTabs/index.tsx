import React, { useEffect, useState } from "react";
import { Box, Tab, IconButton } from "@mui/material";
import { TabContext, TabList } from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import { useFormContext } from "react-hook-form";
import ErrorIcon from "@mui/icons-material/Error";

import classes from "./FeesTabs.module.scss";

interface FeesTabsProps {
  children?: React.ReactNode;
  prices: any[];
  roundedIndicator?: boolean;
  addNewPrice: any;
}

export const NewTabButton = ({ addNewPrice }: { addNewPrice: any }) => {
  return (
    <IconButton
      aria-label="add"
      size="small"
      sx={{ ml: 2 }}
      color="secondary"
      onClick={addNewPrice}
    >
      <AddIcon />
    </IconButton>
  );
};

export default function FeesTabs({
  children,
  prices,
  roundedIndicator = true,
  addNewPrice,
}: FeesTabsProps) {
  const [selectedTab, setSelectedTab] = useState("");

  const {
    watch,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    const lastTab = prices.length > 0 ? prices[prices.length - 1].id : "";
    setSelectedTab(lastTab);
  }, [prices.length]);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (event: React.ChangeEvent<{}>, newTab: string) => {
    setSelectedTab(newTab);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      {selectedTab !== "" && (
        <TabContext value={selectedTab}>
          <TabList
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            classes={{
              indicator: roundedIndicator
                ? classes.roundedIndicator
                : undefined,
            }}
          >
            <NewTabButton addNewPrice={addNewPrice} />
            {prices.map((price, index) => {
              const minimumCartPrice = watch(
                `customerFees[${index}].minimumCartPrice`
              );

              const priceErrors = errors?.customerFees
                ? errors?.customerFees[index]
                : null;

              return (
                <Tab
                  key={price.id}
                  label={minimumCartPrice + " €"}
                  value={price.id}
                  classes={{ selected: classes.tabRoot }}
                  sx={{ mx: 2 }}
                  icon={priceErrors ? <ErrorIcon /> : undefined}
                  iconPosition="end"
                />
              );
            })}
          </TabList>
          {children}
        </TabContext>
      )}
    </Box>
  );
}
