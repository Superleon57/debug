import React, { ReactNode } from "react";
import { Grid, Card, CardHeader, Divider, CardContent } from "@mui/material";

interface FormSectionProps {
  title: string;
  children: ReactNode | ReactNode[];
}

const FormSection = ({ title, children }: FormSectionProps) => {
  return (
    <Grid item xs={12}>
      <Card sx={{ borderRadius: "10px" }}>
        <CardHeader title={title} />
        <Divider />
        <CardContent>
          <Grid container spacing={1} alignItems="center">
            {children}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default FormSection;
