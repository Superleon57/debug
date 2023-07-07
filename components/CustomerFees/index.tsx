import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useFormContext, useFieldArray } from "react-hook-form";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { v4 as uuid } from "uuid";
import { TabPanel } from "@mui/lab";

import { KmInput, MaskedEuroInput } from "components/FormSection/FormInput";
import FeesTabs from "components/FeesTabs";
import ErrorMessage from "components/ErrorMessage";
import { Fees } from "utils/types/Fees";

const CustomerFeesLevel = ({
  priceIndex,
  levelIndex,
}: {
  priceIndex: number;
  levelIndex: number;
}) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <KmInput
          label="A partir de"
          name={`customerFees[${priceIndex}].levels[${levelIndex}].from`}
        />
      </Grid>
      <Grid item xs={3}>
        <KmInput
          label="Jusqu'à"
          name={`customerFees[${priceIndex}].levels[${levelIndex}].to`}
        />
      </Grid>
      <Grid item xs={3}>
        <MaskedEuroInput
          label="Livraison à "
          name={`customerFees[${priceIndex}].levels[${levelIndex}].delivery`}
        />
      </Grid>
      <Grid item xs={3}>
        <MaskedEuroInput
          label="Frais de service"
          name={`customerFees[${priceIndex}].levels[${levelIndex}].service`}
        />
      </Grid>
    </Grid>
  );
};

const PriceTab = ({
  priceLevel,
  index,
}: {
  priceLevel: any;
  index: number;
}) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `customerFees[${index}].levels`,
  });

  const addCustomerFeesLevel = () => {
    append({ id: uuid(), km: 0, delivery: 0, service: 0 });
  };

  const customerFeesError = errors?.customerFees?.length
    ? errors?.customerFees[index]
    : [];

  return (
    <TabPanel value={priceLevel.id}>
      <Stack direction="row" spacing={2} maxWidth={400}>
        <MaskedEuroInput
          label="Panier minimum"
          name={`customerFees[${index}].minimumCartPrice`}
          scale={0}
        />
        <MaskedEuroInput
          label="Panier maximum"
          name={`customerFees[${index}].maximumCartPrice`}
          scale={0}
        />
      </Stack>

      {fields.length === 0 && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="body1">
            Aucun frais de client. Ajoutez en un en cliquant sur le bouton
            ci-dessous
          </Typography>
        </Box>
      )}

      <ErrorMessage errors={customerFeesError} field={"levels"} />

      {fields.map((serviceFee, levelIndex) => (
        <Box sx={{ display: "flex", alignItems: "end" }} key={serviceFee.id}>
          <CustomerFeesLevel priceIndex={index} levelIndex={levelIndex} />
          <IconButton
            color="error"
            component="label"
            onClick={() => remove(levelIndex)}
          >
            <DeleteForeverIcon />
          </IconButton>
        </Box>
      ))}

      <Button
        variant="outlined"
        color="secondary"
        onClick={addCustomerFeesLevel}
        sx={{ mt: 2 }}
      >
        Ajouter une distance
      </Button>
    </TabPanel>
  );
};

export const CustomerFees = () => {
  const {
    formState: { errors },
    control,
  } = useFormContext<Fees>();

  const { fields, append } = useFieldArray({
    control,
    name: "customerFees",
  });

  const addNewPrice = () => {
    if (fields.length === 0) {
      append({
        id: uuid(),
        minimumCartPrice: 20,
        maximumCartPrice: 30,
        levels: [],
      });

      return;
    }

    const highestPrice = Math.max(
      ...fields.map((field) => field.minimumCartPrice)
    );
    append({
      id: uuid(),
      minimumCartPrice: highestPrice,
      maximumCartPrice: highestPrice + 10,
      levels: [],
    });
  };

  return (
    <Card
      sx={{
        borderRadius: "10px",
        height: "100%",
      }}
    >
      <CardHeader title="Frais client" />

      <Divider />
      <CardContent>
        <FeesTabs prices={fields} addNewPrice={addNewPrice}>
          <ErrorMessage errors={errors} field={`customerFees`} />

          {fields.map((priceLevel, index) => (
            <PriceTab
              priceLevel={priceLevel}
              key={priceLevel.id}
              index={index}
            />
          ))}
        </FeesTabs>

        {fields.length === 0 && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="body1">
              Aucun niveau de frais client. Ajoutez en un en cliquant sur le
              bouton ci-dessus
            </Typography>
          </Box>
        )}

        <ErrorMessage errors={errors} field={`customerFees`} />
      </CardContent>
    </Card>
  );
};
