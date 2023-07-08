import React, { useMemo, useState } from "react";
import {
  Button,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  Box,
  ListSubheader,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { MuiColorInput } from "mui-color-input";
import { LoadingButton } from "@mui/lab";

import sizes from "store/data/sizes.json";
import { client } from "utils/api";
import { showPermanantError, showSuccess } from "utils/toastify";
import { RootState, useDispatch, useSelector } from "store";
import { addColor, addSize } from "store/reducers/shopSlice";

import classes from "./ProductVariant.module.scss";
import DeleteDialog from "./DeleteDialog";

type Color = {
  id: string;
  name: string;
  value: string;
  checked: boolean;
};

type Size = {
  id: string;
  name: string;
  value: string;
  checked: boolean;
};

type ProductVariantProps = {
  type: "color" | "size";
  handleChecked: (value: Color[] | Size[]) => void;
  selected: Color[] | Size[];
};

const ProductVariant = ({
  type,
  handleChecked,
  selected,
}: ProductVariantProps) => {
  const dispatch = useDispatch();
  const [newVariant, setNewVariant] = useState(false);
  const [value, setValue] = useState("#fff");
  const [name, setName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(-1);

  const values = useSelector((state: RootState) =>
    type === "color" ? state.shop.colors : state.shop.sizes
  );

  const customValues = {
    name: "Personnalisé",
    sizes: values,
  };

  const staticValues = useMemo(() => {
    const values = [customValues, ...sizes];
    return values;
  }, []);

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
    setValue("#fff");
    setName("");
    setSelectedIndex(-1);
  };

  const handleSubmitVariant = async () => {
    setIsLoading(true);
    if (type === "color") {
      await createColor({ name, value });
    }
    if (type === "size") {
      await createSize({ name, value: name });
    }
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

  const handleToggle = (variant: Color | Size) => () => {
    handleChecked(variant);
  };

  const handleMouseEnter = (index: number) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(-1);
  };

  return (
    <>
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          height: 200,
          overflow: "auto",
        }}
        subheader={<li />}
      >
        {staticValues?.map((type, index) => {
          return (
            <li key={index}>
              <ListSubheader
                key={index}
                component="div"
                id="nested-list-subheader"
              >
                {type.name}
              </ListSubheader>

              {type?.sizes.map((variant, index) => {
                const labelId = `checkbox-list-label-${variant?.value}`;
                const isChecked =
                  selected?.findIndex((v) => v.value === variant?.value) !== -1;
                return (
                  <ListItem
                    key={index}
                    disablePadding
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    secondaryAction={
                      hoverIndex === index &&
                      variant.id && (
                        <DeleteDialog variant={variant} type={type} />
                      )
                    }
                  >
                    <ListItemButton
                      role={undefined}
                      onClick={handleToggle(variant)}
                      dense
                    >
                      <ListItemIcon sx={{ alignItems: "center" }}>
                        <Checkbox
                          edge="start"
                          tabIndex={-1}
                          disableRipple
                          checked={isChecked}
                        />
                        {type === "color" && (
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: 1,
                              mr: 1,
                              bgcolor: variant.value,
                              boxShadow: "0 1px 3px 0 #000",
                            }}
                          />
                        )}
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={variant.name} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </li>
          );
        })}
      </List>

      {newVariant && (
        <Grid container alignItems="center" sx={{ mt: 2 }} spacing={2}>
          {type === "color" && (
            <Grid item xs={3}>
              <MuiColorInput
                value={value}
                format="hex"
                isAlphaHidden
                className={classes.colorPicker}
                onChange={(color) => setValue(color)}
              />
            </Grid>
          )}
          <Grid item xs={type === "color" ? 9 : 12}>
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
              {selectedIndex === -1 ? "Ajouter" : "Modifier"}
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

export default ProductVariant;
