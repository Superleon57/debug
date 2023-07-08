import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Grid, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { addSize } from "store/reducers/shopSlice";
import { client } from "utils/api";
import { showSuccess, showPermanantError } from "utils/toastify";
import { useDispatch } from "store";

import classes from "./ProductVariant.module.scss";

const NewSizeButton = () => {
  const dispatch = useDispatch();
  const [newVariant, setNewVariant] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function createSize({ name, value }: { name: string; value: string }) {
    try {
      const body = { payload: { name, value } };
      const { data } = await client.post("/protected/admin/shop/size", body);
      showSuccess("Taille ajoutée avec succès");

      const newSize = data.payload;
      dispatch(addSize(newSize));
    } catch (err) {
      if (err.code === "SIZE_ALREADY_EXIST") {
        showPermanantError("Cette taille existe déjà.");
      } else {
        showPermanantError("Impossible de créer la taille.");
      }
    }
  }

  const resetVariant = () => {
    setNewVariant(false);
    setName("");
  };

  const handleSubmitVariant = async () => {
    setIsLoading(true);
    await createSize({ name, value: name });
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
          <Grid item xs={12}>
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

export default NewSizeButton;
