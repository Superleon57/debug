import * as React from "react";
import { Skeleton, Box, Grid } from "@mui/material";

import FormSection from "components/FormSection";

const InputSkeleton = ({ height = 40 }: { height?: number }) => (
  <Skeleton variant="rounded" width="100%" height={height} sx={{ mt: 2 }} />
);

const ListSkeleton = ({ size = 5 }: { size?: number }) => (
  <>
    {[...Array(size)].map((_, index) => (
      <Skeleton
        variant="rounded"
        width="100%"
        height={30}
        sx={{ mt: 1 }}
        key={index}
      />
    ))}
  </>
);

const OrderPageSkeleton = ({ rowCount = 1 }: { rowCount?: number }) => {
  if (rowCount < 1) {
    rowCount = 1;
  }
  return (
    <Box sx={{ p: "50px", height: 1 }}>
      <Skeleton variant="text" sx={{ fontSize: "1.5rem" }} width="40%" />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Skeleton variant="text" sx={{ fontSize: "1.5rem" }} width="40%" />

        <Skeleton variant="rounded" width={120} height={40} />
      </Box>

      <Grid container spacing={2} alignItems="flex-start">
        <Grid item md={12} lg={9} container spacing={3}>
          <FormSection title="Images">
            <>
              {[...Array(3)].map((_, index) => (
                <Skeleton
                  variant="rounded"
                  width={80}
                  height={100}
                  key={index}
                  sx={{ ml: 2 }}
                />
              ))}
            </>
          </FormSection>

          <FormSection title="Détails du produit">
            <Skeleton
              variant="rounded"
              width="100%"
              height={40}
              sx={{ mt: 2 }}
            />

            <InputSkeleton height={120} />

            <InputSkeleton />

            <InputSkeleton />
          </FormSection>

          <FormSection title="Prix">
            <InputSkeleton />
          </FormSection>

          <FormSection title="Inventaire">
            <InputSkeleton height={20} />

            <InputSkeleton />
          </FormSection>
        </Grid>

        <Grid item md={12} lg={3} container spacing={3}>
          <FormSection title="Genre">
            <InputSkeleton />
          </FormSection>
          <FormSection title="Catégories">
            <ListSkeleton />
          </FormSection>
          <FormSection title="Filtre écoresponsable">
            <ListSkeleton />
          </FormSection>
        </Grid>
        <Skeleton variant="rounded" width={120} height={40} sx={{ mt: 2 }} />
      </Grid>
    </Box>
  );
};

export default OrderPageSkeleton;
