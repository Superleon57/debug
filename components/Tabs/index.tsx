import React, { useState } from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList } from "@mui/lab";

import classes from "./Tabs.module.scss";

interface TabsProps {
  children?: React.ReactNode;
  titles: string[];
  roundedIndicator?: boolean;
}

export default function Tabs({
  children,
  titles,
  roundedIndicator = true,
}: TabsProps) {
  const [selectedTab, setSelectedTab] = useState(titles[0]);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (event: React.ChangeEvent<{}>, newTab: string) => {
    setSelectedTab(newTab);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={selectedTab}>
        <TabList
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          classes={{
            indicator: roundedIndicator ? classes.roundedIndicator : undefined,
          }}
        >
          {titles.map((title) => (
            <Tab
              key={title}
              label={title}
              value={title}
              classes={{ selected: classes.tabRoot }}
              sx={{ mx: 2 }}
            />
          ))}
        </TabList>
        {children}
      </TabContext>
    </Box>
  );
}
