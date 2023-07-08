import React, { useMemo } from "react";
import {
  List,
  ListSubheader,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { RootState, useSelector } from "store";
import sizes from "store/data/sizes.json";
import shoesSizes from "store/data/shoesSizes.json";
import { Size } from "utils/types/Product";

import SizesListItem from "./SizesListItem";
import NewSizeButton from "./NewSizeButton";

type ProductVariantProps = {
  handleChecked: (value: Size) => void;
  selected: Size[];
};

const SizesList = ({ handleChecked, selected }: ProductVariantProps) => {
  const shopCustomSizes = useSelector((state: RootState) => state.shop.sizes);

  const staticValues = useMemo(() => {
    const customSizes = {
      name: "Personnalisé",
      sizes: shopCustomSizes,
    };

    const shoes = {
      name: "Chaussures",
      sizes: shoesSizes,
    };

    const values = [customSizes, ...sizes, shoes];
    return values;
  }, [shopCustomSizes]);

  return (
    <>
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          height: 300,
          overflow: "auto",
        }}
        subheader={<li />}
      >
        {staticValues?.map((type, index) => {
          return (
            <Accordion key={index}>
              <ListSubheader component="div">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{type.name}</Typography>
                </AccordionSummary>
              </ListSubheader>
              <AccordionDetails>
                {type?.sizes.map((size: Size, index: number) => {
                  const labelId = `checkbox-list-label-${size?.value}`;
                  const isChecked =
                    selected?.findIndex((v) => v.value === size?.value) !== -1;
                  const canDelete =
                    shopCustomSizes.findIndex((s) => s.id === size?.id) !== -1;

                  return (
                    <SizesListItem
                      key={index}
                      {...{
                        size,
                        labelId,
                        isChecked,
                        canDelete,
                        handleChecked,
                      }}
                    />
                  );
                })}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </List>

      <NewSizeButton />
    </>
  );
};

export default SizesList;
