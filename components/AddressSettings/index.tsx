import React, { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Grid, Typography } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

import AutoCompleteAddressInput from "components/AutoCompleteAddressInput";
import GoogleMap from "components/Map/GoogleMap";
import PinIcon from "components/Map/PinIcon";
import { client } from "utils/api";
import { showSuccess, showPermanantError } from "utils/toastify";
import { Shop } from "utils/types/Shop";

const addressSchema = yup.object().shape({
  address: yup
    .object()
    .shape({
      description: yup.string().required("L'adresse est obligatoire"),
      place_id: yup.string().required(),
    })
    .nullable()
    .required("L'adresse est obligatoire"),
});

const AddressSettings = ({ shop }: { shop: Shop }) => {
  const methods = useForm<{ address: any }>({
    resolver: yupResolver(addressSchema),
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const [center, setCenter] = useState({ lat: 48.846901, lng: 2.31671 });
  const [zoom, setZoom] = useState(15);
  const [isLoading, setIsLoading] = useState(false);

  const address = watch("address");

  const fetchUpdateAddress = async () => {
    await client
      .patch(`/protected/admin/shop/address`, {
        payload: { placeId: address.place_id },
      })
      .then(() => {
        showSuccess("L'adresse de votre boutique été mises à jour");
      })
      .catch(() => {
        showPermanantError("Une erreur est survenue");
      });
  };

  const onSubmit = () => {
    setIsLoading(true);
    fetchUpdateAddress().finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (shop?.address) {
      setZoom(15);
      setCenter({
        lat: shop.address.latitude,
        lng: shop.address.longitude,
      });
    }
  }, [shop]);

  useEffect(() => {
    if ((window as any).google) {
      const geocoder = new (window as any).google.maps.Geocoder();

      geocoder
        .geocode({ placeId: address?.place_id })
        .then(({ results }: any) => {
          setZoom(15);
          setCenter({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          });
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, [address]);

  return (
    <FormProvider {...methods}>
      <Grid
        container
        spacing={2}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid item xs={12}>
          <Typography variant="h5" color="initial">
            Adresse
          </Typography>
          <Typography variant="body2" color="initial">
            {"Saisissez l'adresse de votre magasin"}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <AutoCompleteAddressInput
            defaultAddress={shop?.address?.address}
            errors={errors}
          />
          <GoogleMap center={center} zoom={zoom}>
            <PinIcon />
          </GoogleMap>
        </Grid>
        <Grid item xs={6}>
          <LoadingButton
            type="submit"
            variant="contained"
            color="secondary"
            loading={isLoading}
          >
            Sauvegarder
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default AddressSettings;
