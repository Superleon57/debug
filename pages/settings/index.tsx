import React from "react";
import { Control, Controller, FieldPath, useForm } from "react-hook-form";
import { LoadingButton, TabPanel } from "@mui/lab";
import { Grid, InputLabel, OutlinedInput, Typography } from "@mui/material";
import { connect } from "react-redux";

import ShopLogo from "components/ShopLogo";
import Tabs from "components/Tabs";
import OpeningTime from "components/OpeningTime";
import { RootState } from "store";
import { getShop } from "store/reducers/shopSlice";
import { Shop } from "utils/types/Shop";
import { client } from "utils/api";
import { showPermanantError, showSuccess } from "utils/toastify";
import AddressSettings from "components/AddressSettings";
import SoundSettings from "components/SoundSettings";

import classes from "./Settings.module.scss";

import type { FieldValues } from "react-hook-form";

type GeneralFormValues = {
  name: string;
  slogan: string;
  description: string;
};

export type SettingsInputProps = {
  label: string;
  value?: string;
  control: Control<GeneralFormValues>;
  name: FieldPath<FieldValues>;
  hidden?: boolean;
  checked?: boolean;
  args?: any;
};

function SettingsInput({
  label,
  value,
  control,
  name,
  hidden = false,
  ...args
}: SettingsInputProps) {
  return (
    <Grid item xs={12} className={classes.InputContainer}>
      <InputLabel className={classes.inputLabel} hidden={hidden}>
        {label}
      </InputLabel>
      <Controller
        render={({ field }) => (
          <OutlinedInput
            {...field}
            className={classes.input}
            hidden={hidden}
            fullWidth
            {...args}
          />
        )}
        name={name}
        control={control}
        defaultValue={value}
      />
    </Grid>
  );
}

function SectionTitle({
  title,
  subTitle,
  columns = 12,
}: {
  title?: string;
  subTitle?: string;
  columns?: number;
}) {
  return (
    <Grid item xs={columns}>
      <Typography variant="h5" color="initial">
        {title}
      </Typography>
      <Typography variant="body2" color="initial">
        {subTitle}
      </Typography>
    </Grid>
  );
}

function LogoSettings() {
  return (
    <Grid container>
      <SectionTitle title="Votre logo" />

      <Grid item xs={6}>
        <ShopLogo />

        <Typography variant="body2" color="initial">
          La taille recommandée est de 256x256px
        </Typography>
      </Grid>
    </Grid>
  );
}

function GeneralSettings({ shop }: { shop: Shop }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const { handleSubmit, control } = useForm<GeneralFormValues>({
    defaultValues: {
      name: shop?.name || "Nouvelle boutique",
      slogan: shop?.slogan || "",
      description: shop?.description || "",
    },
  });

  const fetchUpdateShop = async (data: GeneralFormValues) => {
    await client
      .patch(`/protected/admin/shop/`, { payload: data })
      .then(() => {
        showSuccess("Les informations ont été mises à jour");
      })
      .catch(() => {
        showPermanantError("Une erreur est survenue");
      });
  };

  const onSubmit = (data: GeneralFormValues) => {
    setIsLoading(true);
    fetchUpdateShop(data).finally(() => setIsLoading(false));
  };

  return (
    <Grid
      container
      sx={{ mt: 2 }}
      onSubmit={handleSubmit(onSubmit)}
      component="form"
    >
      <SectionTitle
        title="Informations"
        subTitle="Saisissez les informations générales de votre magasin"
      />

      <Grid item xs={6}>
        <SettingsInput
          label="Nom de la société"
          control={control}
          name="name"
        />
      </Grid>
      <Grid item xs={6}>
        <SettingsInput label="Slogan" control={control} name="slogan" />
      </Grid>

      <Grid item xs={12}>
        <SettingsInput
          label="Description"
          control={control}
          name="description"
          multiline={true}
          rows={8}
        />
      </Grid>

      <LoadingButton
        type="submit"
        variant="contained"
        color="secondary"
        loading={isLoading}
      >
        Sauvegarder
      </LoadingButton>
    </Grid>
  );
}

const Settings = ({ shop }: { shop: Shop }) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Tabs titles={["Général", "Adresse", "Horaires", "Autre"]}>
          <TabPanel value="Général">
            <LogoSettings />
            <GeneralSettings shop={shop} />
          </TabPanel>
          <TabPanel value="Adresse">
            <AddressSettings shop={shop} />
          </TabPanel>
          <TabPanel value="Horaires">
            <OpeningTime />
          </TabPanel>
          <TabPanel value="Autre">
            <SoundSettings />
          </TabPanel>
        </Tabs>
      </Grid>
    </Grid>
  );
};

Settings.title = "Paramètres";

export default connect((state: RootState) => ({
  shop: getShop(state),
}))(Settings);
