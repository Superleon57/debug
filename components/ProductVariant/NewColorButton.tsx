import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Grid, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { MuiColorInput } from "mui-color-input";

import { addColor } from "store/reducers/shopSlice";
import { client } from "utils/api";
import { showSuccess, showPermanantError } from "utils/toastify";
import { useDispatch } from "store";

import classes from "./ProductVariant.module.scss";

const NewColorButton = () => {
  const dispatch = useDispatch();
  const [newVariant, setNewVariant] = useState(false);
  const [value, setValue] = useState("#fff");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function createColor({ name, value }: { name: string; value: string }) {
    try {
      const body = { payload: { name, value } };
      const { data } = await client.post("/protected/admin/shop/color", body);
      showSuccess("Couleur ajoutée avec succès");
      const newColor = data.payload;
      dispatch(addColor(newColor));
    } catch (err) {
      if (err.code === "COLOR_ALREADY_EXIST") {
        showPermanantError("Ce nom de couleur existe déjà.");
      } else {
        showPermanantError("Impossible de créer la couleur.");
      }
    }
  }

  const resetVariant = () => {
    setNewVariant(false);
    setValue("#ffffff");
    setName("");
  };

  const handleSubmitVariant = async () => {
    setIsLoading(true);
    await createColor({ name, value });
    resetVariant();

    setIsLoading(false);
  };

  const toggleNewVariant = () => {
    if (newVariant) {
      resetVariant();
    } else {
      setNewVariant(true);
    }
  };

  return (
    <>
      {newVariant && (
        <Grid container alignItems="center" sx={{ mt: 2 }} spacing={2}>
          <Grid item xs={3}>
            <MuiColorInput
              value={value}
              format="hex"
              isAlphaHidden
              className={classes.colorPicker}
              onChange={(color) => setValue(color)}
            />
          </Grid>
          <Grid item xs={9}>
            <TextField
              label="Nom"
              hiddenLabel
              variant="outlined"
              className={classes.input}
              onChange={(e) => setName(e.target.value)}
              size="small"
              value={name}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }} container justifyContent="flex-end">
            <LoadingButton
              variant="contained"
              onClick={handleSubmitVariant}
              sx={{ mr: 2 }}
              loading={isLoading}
            >
              Ajouter
            </LoadingButton>

            <Button variant="contained" onClick={toggleNewVariant}>
              Annuler
            </Button>
          </Grid>
        </Grid>
      )}
      {!newVariant && (
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mt: 2 }}
          onClick={toggleNewVariant}
        >
          <AddIcon />
        </Button>
      )}
    </>
  );
};

export default NewColorButton;
