import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button } from "@mui/material";

import { feesSchema } from "utils/validation/feesSchema";
import { Fees } from "utils/types/Fees";
import { client } from "utils/api";
import { showSuccess, showPermanantError } from "utils/toastify";
import { formatFees } from "utils/types/FormatFees";
import { FeeForm } from "components/FeeForm";

const FeesPage = () => {
  const [fees, setFees] = useState<Fees>({} as Fees);
  const methods = useForm<Fees>({
    resolver: yupResolver(feesSchema),
  });

  const { handleSubmit } = methods;

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const { data } = await client.get("/protected/supervisor/fees");

      const fees = data.payload;

      if (!fees) return;

      setFees(fees);

      const formatedFees = formatFees(fees);

      methods.reset(formatedFees);
    } catch (err) {
      if (err.message) {
        showPermanantError(err.message);
      } else {
        showPermanantError("Une erreur est survenue.");
      }
    }
  };

  const onSubmit = (data: Fees) => {
    updateFees(data);
  };

  const updateFees = async (fees: Fees) => {
    try {
      await client.post("/protected/supervisor/fees", { payload: { fees } });

      showSuccess("Les frais de livraison ont été mis à jour.");
    } catch (err) {
      console.log(err);
      if (err.message) {
        showPermanantError(err.message);
      } else {
        showPermanantError("Une erreur est survenue.");
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FeeForm fees={fees} />
        <Box>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ mt: 2 }}
            type="submit"
          >
            Sauvegarder
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default FeesPage;
