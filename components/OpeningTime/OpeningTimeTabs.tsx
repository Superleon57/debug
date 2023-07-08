import React from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList } from "@mui/lab";
import ErrorIcon from "@mui/icons-material/Error";

interface OpeningTimeTabsProps {
  children?: React.ReactNode;
  errors: any;
}

export default function OpeningTimeTabs({
  children,
  errors,
}: OpeningTimeTabsProps) {
  const days = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];
  const [value, setValue] = React.useState(days[0]);

  const handleChange = (
    event: React.ChangeEvent<unknown>,
    newValue: string
  ) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
        >
          {days.map((day, index) => {
            const dayErrors = errors?.openingTimes
              ? errors?.openingTimes[index]
              : null;
            return (
              <Tab
                label={day}
                value={day}
                key={day}
                icon={dayErrors ? <ErrorIcon /> : undefined}
                iconPosition="end"
              />
            );
          })}
        </TabList>
        {children}
      </TabContext>
    </Box>
  );
}
