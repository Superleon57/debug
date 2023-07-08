import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  IconButton,
  Button,
  Modal,
  Box,
  Grid,
  CardHeader,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormContext } from "react-hook-form";

import { useDispatch } from "store";
import { fetchColors, fetchSizes } from "store/reducers/shopSlice";
import { Color, Product, Size, Variant } from "utils/types/Product";
import SizesList from "components/ProductVariant/SizesList";
import ColorsList from "components/ProductVariant/ColorsList";

import classes from "./ProductDetails.module.scss";

const CloseButton = ({ handleClose }: { handleClose: () => void }) => {
  return (
    <IconButton
      color="secondary"
      onClick={handleClose}
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        m: 2,
      }}
    >
      <CloseIcon />
    </IconButton>
  );
};

const InventoryModal = forwardRef((params, ref) => {
  const dispatch = useDispatch();
  const { setValue, getValues } = useFormContext<Product>();

  const [open, setOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState<Size[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Color[]>([]);

  useEffect(() => {
    dispatch(fetchColors());
    dispatch(fetchSizes());
  }, []);

  useImperativeHandle(ref, () => ({
    openModal() {
      setOpen(true);
    },
  }));

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckedSize = (size: Size) => {
    const alreadySelected = selectedSizes.find((s) => s.id === size.id);

    if (alreadySelected) {
      const updatedSizes = selectedSizes.filter((s) => s.id !== size.id);
      setSelectedSizes(updatedSizes);
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleCheckedColor = (color: Color) => {
    const alreadySelected = selectedColors.find((s) => s.id === color.id);

    if (alreadySelected) {
      const updatedColors = selectedColors.filter((s) => s.id !== color.id);
      setSelectedColors(updatedColors);
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const generateVariantId = (color: Color, size: Size) =>
    `${color.name}_${size.name}`;

  const isVariantAlreadyGenerated = (
    generatedVariants: Variant[],
    color: Color,
    size: Size
  ) =>
    generatedVariants?.find(
      (variant) => variant.color.id === color.id && variant.size.id === size.id
    );

  type generateVariantsProps = {
    selectedColors: Color[];
    selectedSizes: Size[];
  };

  const generateVariants = ({
    selectedColors,
    selectedSizes,
  }: generateVariantsProps) => {
    const variants: Variant[] = [];
    const generatedVariants = getValues("Variants") || [];

    if (!selectedColors.length || !selectedSizes.length) {
      return;
    }

    selectedColors.forEach((color) => {
      selectedSizes.forEach((size) => {
        const variantId = generateVariantId(color, size);
        const existingVariant = variants.find(
          (variant) => variant.id === variantId
        );

        if (existingVariant) {
          return;
        }

        const alreadyGeneratedVariant = isVariantAlreadyGenerated(
          generatedVariants,
          color,
          size
        );

        if (alreadyGeneratedVariant) {
          // variants.push(alreadyGeneratedVariant);
          return;
        }

        const variant: Variant = {
          id: variantId,
          color,
          size,
          quantity: 1,
        };

        variants.push(variant);
      });
    });

    setValue("Variants", [...generatedVariants, ...variants]);
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box className={classes.modal}>
          <CloseButton handleClose={handleClose} />

          <Grid container spacing={1}>
            <Grid item sm={6} xs={12}>
              <Card sx={{ borderRadius: "10px" }}>
                <CardHeader title="Tailles" />

                <Divider />
                <CardContent sx={{ py: 0 }}>
                  <SizesList
                    selected={selectedSizes}
                    handleChecked={handleCheckedSize}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Card sx={{ borderRadius: "10px" }}>
                <CardHeader title="Couleurs" />

                <Divider />
                <CardContent sx={{ py: 0 }}>
                  <ColorsList
                    selected={selectedColors}
                    handleChecked={handleCheckedColor}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={() =>
                generateVariants({ selectedColors, selectedSizes })
              }
            >
              Générer les variantes
            </Button>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
});

InventoryModal.displayName = "InventoryModal";

export default InventoryModal;
