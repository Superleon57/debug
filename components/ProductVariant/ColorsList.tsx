import React, { useMemo } from "react";
import {
  List,
  ListSubheader,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { RootState, useSelector } from "store";
import { Color } from "utils/types/Product";
import colors from "store/data/colors.json";

import ColorsListItem from "./ColorsListItem";
import NewColorButton from "./NewColorButton";

type ProductVariantProps = {
  handleChecked: (value: Color) => void;
  selected: Color[];
};

const ProductVariant = ({ handleChecked, selected }: ProductVariantProps) => {
  const shopCustomColors = useSelector((state: RootState) => state.shop.colors);

  const staticValues = useMemo(() => {
    const customColors = {
      name: "Personnalisé",
      colors: shopCustomColors,
    };
    const values = [customColors, ...colors];
    return values;
  }, [shopCustomColors]);

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
                {type?.colors.map((color, index) => {
                  const labelId = `checkbox-list-label-${color?.value}`;
                  const isChecked =
                    selected?.findIndex((v) => v.value === color?.value) !== -1;
                  const canDelete =
                    shopCustomColors.findIndex((v) => v.id === color?.id) !==
                    -1;

                  return (
                    <ColorsListItem
                      key={index}
                      {...{
                        color,
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
      <NewColorButton />
    </>
  );
};

export default ProductVariant;
