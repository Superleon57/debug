import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { Avatar, Box, Button } from "@mui/material";

import { customShopFeeSchema } from "utils/validation/feesSchema";
import { CustomShopFee } from "utils/types/Fees";
import { client } from "utils/api";
import { showSuccess, showPermanantError } from "utils/toastify";
import { formatFees } from "utils/types/FormatFees";
import { FeeForm } from "components/FeeForm";
import { shopLogoAvatar } from "utils/avatar";
import { Shop } from "utils/types/Shop";
import { FormSwitch } from "components/FormSection/FormInput";

const ShopFeePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [shop, setShop] = useState<Shop>({} as Shop);

  const [fees, setFees] = useState<CustomShopFee>({} as CustomShopFee);
  const methods = useForm<CustomShopFee>({
    resolver: yupResolver(customShopFeeSchema),
  });

  const { handleSubmit, watch } = methods;

  useEffect(() => {
    fetchShopFees(id);
  }, [id]);

  const fetchShopFees = async (id) => {
    try {
      const { data } = await client.get("/protected/supervisor/fees/" + id);

      const { fees, shop } = data.payload;
      setShop(shop);
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

  const onSubmit = (data: CustomShopFee) => {
    updateFees(data);
  };

  const updateFees = async (fees: CustomShopFee) => {
    try {
      await client.post("/protected/supervisor/shop-fees", {
        payload: { fees, shopId: id },
      });

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
      {shop?.id && (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" alignItems="center" gap={2} sx={{ p: 2 }}>
              <Avatar {...shopLogoAvatar(shop, 120)} src={shop?.logo} />
              <h2>{shop?.name}</h2>
            </Box>

            <FormSwitch
              name="useCustomFees"
              label="Frais de livraison personalisés"
              value={false}
            />

            {watch("useCustomFees") && <FeeForm fees={fees} />}

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
        </>
      )}
    </FormProvider>
  );
};

export default ShopFeePage;
